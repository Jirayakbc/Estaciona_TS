interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query : string): HTMLInputElement | null =>
    document.querySelector(query);

        function calcTempo(mil: number){
            const min = Math.floor(mil / 60000)
            const sec = Math.floor((mil % 60000) / 1000)
            const valunitario = 8.00
            const total = (min + (sec/100)) * (valunitario/60)

            if (total <= valunitario){
                return `${min}m e ${sec}s' ficou em ${valunitario.toFixed(2)}`;
            }else
            return `${min}m e ${sec}s' ficou em ${total.toFixed(2)}`;



        }
    function patio(){
           function ler(): Veiculo[] {
                return localStorage.patio ? JSON.parse(localStorage.patio) : [];
           } 

           
           function salvar (veiculos: Veiculo[]) {
               localStorage.setItem("patio", JSON.stringify(veiculos))
           }

           function adicionar (veiculo:Veiculo, salva?:boolean){
               const row = document.createElement("tr");

               row.innerHTML = `
               <td>${veiculo.nome}</td>
               <td>${veiculo.placa}</td>
               <td>${veiculo.entrada}</td>
               
               <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
               </td>
               `;

               row.querySelector(".delete")?.addEventListener("click", function(){
                   remover(this.dataset.placa)
               })

               $("#patio")?.appendChild(row)

               if(salva) salvar([...ler(), veiculo]);
           }
           function remover (placa: string) {

                const { entrada , nome } = ler().find(
                    (veiculo) => veiculo.placa === placa
                );

                const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

                if(
                    !confirm(`O veículo ${nome} permaneceu por ${tempo}, Deseja encerrar?`)
                )
                  return;

                salvar(ler().filter((veiculo) => veiculo.placa !== placa));
                render();
           }

           function render (){
               $("#patio")!.innerHTML = "";
               const patio = ler();

               if (patio.length){
                   patio.forEach((veiculo) => adicionar(veiculo));
               }
           }

           return { ler , adicionar , salvar , render };
        }
        
        patio().render();

        $("#cadastrar")?.addEventListener("click", () => {
            const nome = $("#nome")?.value;
            const placa = $("#placa")?.value;

            if (!nome || !placa) {
                alert("Os campos nome e placas são obrigatórios!");
                return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
        
    });
})();
