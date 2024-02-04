class JanelaSobreposta
{
  static windowsSobreposta = document.body;

  /**
   * metódo que recebe todos parâmetros para exibir e/ou poder processar a maniulação dos dados e elementos do DOM em caso de alteração
   * @param {*array} titles_colunas { [title1, title2, title3 ...] | null }
   * @param {*boolean} readjust { false / true }
   * @param {*string} endpoint { url para select dos dados }
   * @param {*string} endpoint_update { url de update dos dados | null }
   * @param {*function} updatePage { function | null }
   */
  static show_window(titles_colunas, readjust, endpoint, endpoint_update, updatePage)
  {
    //creação da das telas para gerar a janela de sobreposta
    const estilo_view=
    'display: flex; justify-content: center; align-items: center;'+
    'position: absolute; top: 0; left: 0; width: 100%; height: 100vh;'+ 
    'background-color: rgba(0,0,0,0.7); z-index:9999;';
    const view_windows = document.createElement ("div");
    view_windows.setAttribute("id","id_windowsSopreposta");
    view_windows.setAttribute("style",estilo_view);
    this.windowsSobreposta.prepend(view_windows)

    const estilo_popUp =  
    'display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;'+
    'width: 40%; min-height: auto; background-color: #888; border-radius: 5px;';
    const popUp = document.createElement("div");
    popUp.setAttribute("style", estilo_popUp);
    popUp.setAttribute("id","div_popUp");
    view_windows.appendChild(popUp);

    fetch (endpoint)
    .then(res=>res.json())
    .then(res=>{
      //constante datas recebe todos os dados do objeto retornado na "res", passsando-os em um array
      const datas = [...Object.values(res[0])];
      //variável cont criada para poder manipular o instituição de cada dado recebido no array data, pois em seguida será necessário na chamada do forEach a seguir
      let cont = 0;
      //criação das linhas do data grid com os respectivos títulos de suas colunas
      titles_colunas.forEach((element) => {
        const estilo_dataItem =  
        'display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;'+
        'width: 100%; padding: 8px;';
        const dataItem = document.createElement("div")
        dataItem .setAttribute("style", estilo_dataItem);
        popUp.appendChild(dataItem);
  
        const estilo_label=  
        'font-size: 18px; font-family:fantasy;';
        const label = document.createElement("lebal");
        label .setAttribute("style", estilo_label);
        label.innerHTML = element;
        dataItem.appendChild(label);
  
        const estilo_input=  
        'width: 100%; outline: none; border-radius: 4px; color: black; font-size: 16px; padding: 2px;';
        const input = document.createElement("input");
        input.setAttribute("style", estilo_input);
        input.setAttribute("type","text");
        input.value = datas[cont];
        //condição criada para sempre manter os dados do ID somente leitura
        if(cont==0)
        {
          dataItem.appendChild(input).readOnly=true;
        }
        else
        {
          dataItem.appendChild(input).readOnly=readjust;
        }
        cont++;
      });

      const estilo_div_rodape = 'width: 100%; margin-top: 5px; margin-bottom:10px;'+
      'display: flex; justify-content: center; align-items: center;';
      const div_rodape = document.createElement("div");
      div_rodape.setAttribute("id","div_buttons");
      div_rodape.setAttribute("style", estilo_div_rodape);
      popUp.appendChild(div_rodape);

      //condicional para poder se criar uma janela de exibição de dados apeans com o botão "OK" ou com os botões "GRAVAR e CANELAR"
      if(readjust === true)
      { 
        const estilo_button = 'width: 40px; height: 30px; background-color: #448; padding: 4px; font-size: 16px; border-radius: 5px; position:absolut';
        const botao = document.createElement("button");
        botao.setAttribute("style", estilo_button);
        botao.setAttribute ("class","button_popUp")
        botao.innerHTML="OK";
        botao.addEventListener("click",(evt)=>{
          view_windows.remove();
        })
        div_rodape.appendChild(botao);
      }
      else
      {
        const estilo_button = 'width: 100px; height: 30px; margin: 0px 20px 0px 20px; background-color: #448; padding: 4px; font-size: 16px; border-radius: 5px; position:absolut';
        const botao_gravar = document.createElement("button");
        botao_gravar.setAttribute("style", estilo_button);
        botao_gravar.setAttribute ("class","button_popUp")
        botao_gravar.innerHTML="GRAVAR";
        botao_gravar.addEventListener("click",(evt)=>
        {
          document.querySelectorAll("input").forEach((element)=>
          {
            endpoint_update += `/${element.value}`
          })
          fetch(endpoint_update)
          .then(res=>{
              if(res.status == 200)
              {
                view_windows.remove();
                updatePage();
              }
              else
              {
                alert("Falha ao atualizar os dados.\nTente novamente.")
              }
          })
        })
        div_rodape.appendChild(botao_gravar);

        const botao_cancelar = document.createElement("button");
        botao_cancelar.setAttribute("style", estilo_button);
        botao_cancelar.setAttribute ("class","button_popUp")
        botao_cancelar.innerHTML="CANCELAR";
        botao_cancelar.addEventListener("click",(evt)=>{
          view_windows.remove();
        })
        div_rodape.appendChild(botao_cancelar);
      }
    })
  }
                
}

export default JanelaSobreposta;