(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const minutos = Math.floor(mil / 60000);
        const segundos = Math.floor(mil % 60000) / 1000;
        return `${minutos}m e ${segundos}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []; // somente guar string então deve 'parsear' para JSON
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos)); // para armazenar precisa converter para jSon 
        }
        function addVeiculo(veiculo, save) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td>${veiculo.nome}</td>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.entrada}</td>
                    <td>
                    <button class="delete" data-placa ="${veiculo.placa}">X</button>
                    </td>
                `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remVeiculo(this.dataset.placa);
            });
            (_b = $("#patio-veiculos")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (save)
                salvar([...ler(), veiculo]); //..(tres pontos) ->salvar os antigos "spread"
            // in inline - se for verdadeiro, salva no banco de dados
        }
        function remVeiculo(placa) {
            const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar :`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            renderizar();
        }
        function renderizar() {
            $("#patio-veiculos").innerHTML = ""; // ! = forçar a pegar o html
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => addVeiculo(veiculo));
            }
        }
        return { ler, addVeiculo, remVeiculo, salvar, renderizar };
    }
    patio().renderizar();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        patio().addVeiculo({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
