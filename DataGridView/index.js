import JanelaSobreposta from "./janela_sobreposta.js";

const configDataGridView=
{
    endpoint:"http://127.0.0.1:1880/produto",
    idDestino: "id_dgv-dados"
}

const dataGridView=(configDGV)=>
{
    //ciração da grid no body principal
    const dadosGDV= document.getElementById(configDGV.idDestino)
    dadosGDV.innerHTML="";
    fetch(configDGV.endpoint)
    .then(res=>res.json())
    .then(res=>{
        //criação dos elementos de cada linha que conterá o data grid view,  
        res.forEach((element) => {
            const divlinhas =  document.createElement("div");
            divlinhas.setAttribute("id","id_dgv-dados-linhas");
            divlinhas.setAttribute("class","dgv-dados-linhas");
            
            const id = document.createElement("div");
            id.setAttribute("class","c1");
            id.innerHTML = element.n_id_produto;
            divlinhas.appendChild(id);

            const produto = document.createElement("div");
            produto.setAttribute("class","c2");
            produto.innerHTML = element.s_nome_produto;
            divlinhas.appendChild(produto);

            const marca = document.createElement("div");
            marca.setAttribute("class","c3");
            marca.innerHTML = element.s_marca_produto;
            divlinhas.appendChild(marca);

            const modelo = document.createElement("div");
            modelo.setAttribute("class","c4");
            modelo.innerHTML = element.s_modelo_produto;
            divlinhas.appendChild(modelo);

            const funcoes = document.createElement("div");
            funcoes.setAttribute("class","c5");
            divlinhas.appendChild(funcoes);

            //ciração e configuração do botão excluir
            const imgDelete = document.createElement("img");
            imgDelete.setAttribute("class", "imagens")
            imgDelete.setAttribute("src","./img/delete.svg");
            imgDelete.setAttribute("title","Excluir linha");
            imgDelete.addEventListener("click",(evt)=>{

                //constante elementoDelete recebe o texto da primeira coluna do data grid, no caso o ID, em seguida ocorre o a conexão com o banco de dados (feito através do uso do node-red) e o processo de exclusão que também tem a query passada através do node-red.
                const elementoDelete = evt.target.parentNode.parentNode.firstChild.innerHTML;
                fetch(`http://127.0.0.1:1880/removeproduto/${elementoDelete}`)
                .then(res=>
                    {
                        if(res.status == 200)
                        {
                            evt.target.parentNode.parentNode.remove();
                            alert('Item removido com sucesso')
                        }
                        else
                        {
                            alert("Erro: Tentativa de remoção de dados falhou.")
                        }
                    })
            })
            funcoes.appendChild(imgDelete);
            //fim botão delete

            //criação e configuração do botão editar
            const imgEdit = document.createElement("img");
            imgEdit.setAttribute("class", "imagens")
            imgEdit.setAttribute("src","./img/edit.svg");
            imgEdit.setAttribute("title","Editar dados");
            imgEdit.addEventListener("click",(evt)=>{

                 //constante elemento_id recebe o texto da primeira coluna do data grid, no caso o ID, em seguida é passado para titulosColuna o titulo de cada colunda da gride log após conexão com o banco através das rotas para a vizualizaçao e manipulação do dados com uso do node-red.
                const elemento_id = evt.target.parentNode.parentNode.firstChild.innerHTML;
                const titulosColuna = ["ID", "NOME", "MARCA", "MODELO"]
                const endpoint = `http://127.0.0.1:1880/viewproduto/${elemento_id}`;
                const endpoint_update = `http://127.0.0.1:1880/updateproduto`;
                //função criada para poder ser chamada a criação do data grid novamente. Sendo passada como atributo de paramêtro do modulo JanelaSobreposta, umas vez que é necessário ocorrer a chamada do dataGridView somente após todo processo de alterção.
                function atualiza()
                {
                    dataGridView(configDataGridView)
                }
                //módulo JanelaSobrepostas tem como parametragem o título de cada coluna das linhas do data grid, a informção se os inputs serão somente leitura ou não, o endpoint, e a função que irá reinderizar od elementos da data grid após o processo de atulaização.
                JanelaSobreposta.show_window(titulosColuna, false, endpoint, endpoint_update, atualiza);
            })
            funcoes.appendChild(imgEdit);
            //fim botão editar
            
            //criação do botão visualizar
            const imgVisibility= document.createElement("img");
            imgVisibility.setAttribute("class", "imagens")
            imgVisibility.setAttribute("src","./img/visibility.svg");
            imgVisibility.setAttribute("title","Visualizar dados")
            imgVisibility.addEventListener("click",(evt)=>{
                
                const elementoEdit= evt.target.parentNode.parentNode.firstChild.innerHTML;
                const titulosColuna = ["ID", "NOME", "MARCA", "MODELO"]
                const endpoint = `http://127.0.0.1:1880/viewproduto/${elementoEdit}`;
                JanelaSobreposta.show_window(titulosColuna, true, endpoint);
            })
            funcoes.appendChild(imgVisibility);
            dadosGDV.appendChild(divlinhas);
        });
    })
}

dataGridView(configDataGridView)
