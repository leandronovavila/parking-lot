interface IVeiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function (){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

        function calcTempo (mil: number){
            const minutos = Math.floor (mil / 60000);
            const segundos = Math.floor (mil % 60000) / 1000;

            return `${minutos}m e ${segundos}s`;
        }

        function patio(){
            function ler(): IVeiculo[] {                         //armazenar info no localStorage 
                return localStorage.patio ? JSON.parse(localStorage.patio) : []  // somente guar string então deve 'parsear' para JSON

            }
            function salvar(veiculos: IVeiculo[]){                      //salvar informaçõesno patio
                localStorage.setItem("patio", JSON.stringify(veiculos)); // para armazenar precisa converter para jSon 
            }
            
            
            function addVeiculo(veiculo: IVeiculo, save?: boolean){
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${veiculo.nome}</td>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.entrada}</td>
                    <td>
                    <button class="delete" data-placa ="${veiculo.placa}">X</button>
                    </td>
                `;

                row.querySelector(".delete")?.addEventListener("click", function(){
                    remVeiculo(this.dataset.placa);
                });

                $("#patio-veiculos")?.appendChild(row);

                if (save) salvar([...ler(), veiculo]);       //..(tres pontos) ->salvar os antigos "spread"
                                                             // in inline - se for verdadeiro, salva no banco de dados
            }

            function remVeiculo(placa: string){                            // responsável por tirar o veículo do pátio
                const {entrada, nome} = ler().find((veiculo) => veiculo.placa === placa);                       

                const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

                if(
                    !confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar :`)
                  )
                    return;
                
                salvar(ler().filter(veiculo => veiculo.placa !== placa));
                renderizar();
            }

            function renderizar (){
                $("#patio-veiculos")!.innerHTML = "";  // ! = forçar a pegar o html
                const patio = ler();

                if(patio.length){
                    patio.forEach((veiculo) => addVeiculo(veiculo));
                }
            }

            return {ler, addVeiculo, remVeiculo, salvar, renderizar}
        }

        patio().renderizar();
        $("#cadastrar")?.addEventListener("click", () => {
            const nome = $("#nome")?.value;
            const placa = $("#placa")?.value;

        if(!nome || !placa){
            alert("Os campos nome e placa são obrigatórios");
            return;
        }

        patio().addVeiculo({nome, placa, entrada: new Date().toISOString()}, true)

        

        });
})();