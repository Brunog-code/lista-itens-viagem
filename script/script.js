class gerenciarApp{
    constructor(){
        this.tipo = document.querySelector('#inp-tipo')
        this.descricao = document.querySelector('#inp-descricao')
        this.inpTipoPesquisa = document.querySelector('#inp-tipo-pesquisa')
        this.inpDescricaoPesquisa = document.querySelector('#inp-descricao-pesquisa')
        this.btnCadastrar = document.querySelector('#btn-register')
        this.btnPesquisar = document.querySelector('#btn-pesquisar')
        this.btnClear = document.querySelector('#btn-clear')
        this.colFinalizar = document.querySelector('#col-finaly')
        this.colExcluir = document.querySelector('#col-remove')
        this.indexPage = window.location.pathname.includes('index.html')
        this.consultPage = window.location.pathname.includes('consulta.html')
        this.tableConsult = document.querySelector('#table-lista-body-consulta')
    }

    registrarEventos(){
        if(this.btnCadastrar){
            this.btnCadastrar.addEventListener('click', () => this.gravar())
        }

        if(this.btnPesquisar){
            this.btnPesquisar.addEventListener('click', () => this.exibirNaTabela())
        }

        if(this.btnClear){
            this.btnClear.addEventListener('click', () => this.limparConsulta())
        }
    }

     //trocar status
     trocarStatus(id){
        let items = JSON.parse(localStorage.getItem('item')) || []

        // acha o índice real pelo id
        const index = items.findIndex(item => item.id === id)

        if (index !== -1){
            items[index].statusFinalizado = !items[index].statusFinalizado

            let msg = ''
            if(items[index].statusFinalizado){
                msg = 'Item finalizado!'
                this.toast(msg, '#008000')
            }else{
                msg= 'Item aberto novamente!'
                this.toast(msg, '#ffc107')
            }           

            //atualiza o localStorage
            localStorage.setItem('item', JSON.stringify(items))
            this.exibirNaTabela()
        }
    }
    

    //gravar no localStorage
    gravar(){
       // Inicialize item como um array vazio, ou recupere o array salvo.
       // Adicione o novo item ao array.
       // Guarde o array atualizado de volta no localStorage.

        let item = []

        //recuperar items do localStorage(vem um array)
        let itemsSalvos = localStorage.getItem('item')

        if(itemsSalvos){
            item = JSON.parse(itemsSalvos) //adiciona o array que vier ao array vazio
        }

        let objItem = {
            id: Date.now(), // ID único
            tipo: this.tipo.value,
            descricao: this.descricao.value,
            statusFinalizado: false
        }

        //verifica se tem algum input vazio
        const algumVazio = Object.values(objItem).some(valor => String(valor).trim() === '')

        //impede a gravao se tiver
        if(algumVazio){
            this.toast('Favor preencher todos os campos', '#FF0000')
            return
        }

        item.push(objItem)

        localStorage.setItem('item', JSON.stringify(item))

        this.exibirNaTabela()
        this.toast('Item cadastrado com sucesso','#008000')
        this.tipo.value = ''
        this.descricao.value = ''
    }

    //consultar no localStorage
    consultar(filtro = {}){
        //retorna um array
        let listaItems = localStorage.getItem('item')

        // Se não houver itens, retorna um array vazio
        if(!listaItems){
            return []
        }

         //Converte a string JSON em um array de objetos
        listaItems = JSON.parse(listaItems)

        //aplica os filtros, se existirem
        if(filtro.tipo){
            listaItems = listaItems.filter(item => item.tipo === filtro.tipo)
        }

        // Filtro de descrição (considerando que é uma string)
        if(filtro.descricao){
            listaItems = listaItems.filter(item => 
                item.descricao.toLowerCase().includes(filtro.descricao.toLowerCase()))
        }
        return listaItems
    }

    //na pagina de consulta, os filtros que usuario escolher
    filtroUsuario(){
        const filtros = {}

        if(this.inpTipoPesquisa.value !== '') filtros.tipo =  this.inpTipoPesquisa.value
        if(this.inpDescricaoPesquisa.value !== '') filtros.descricao = this.inpDescricaoPesquisa.value

        return this.consultar(filtros)
    }

    //mostrar na tabela
    exibirNaTabela(){

        if(this.indexPage){
            //index page
            let listaItems = this.consultar()

            //seleciona a tabela
            let tableHome = document.querySelector('#table-lista-body')
            tableHome.innerHTML = ''

            listaItems.forEach((v, i) => {
                //cria a linha
                let row = tableHome.insertRow()

                //cria as colunas          
                switch(v.tipo){
                    case '1':
                        v.tipo = 'Café da manhã'
                        break
                    case '2':
                        v.tipo = 'Lanche'
                        break
                    case '3':
                        v.tipo = 'Jantar'
                        break
                    case '4':
                        v.tipo = 'Limpeza'
                        break
                    case '5':
                        v.tipo = 'Bebida'
                        break
                    case '6':
                        v.tipo = 'Utensílios'
                        break
                }
                row.insertCell(0).innerHTML = v.tipo
                row.insertCell(1).innerHTML = v.descricao
            })
        }else if(this.consultPage){
            //consulta page
            let listaItemsConsult = this.filtroUsuario()

            //seleciona a tabela
            let tableConsult = document.querySelector('#table-lista-body-consulta')
            tableConsult.innerHTML = ''

            //exibe o 'finalizar' e 'excluir' se tiver itens na tabela
            if (listaItemsConsult.length > 0){
                this.colFinalizar.classList.remove('d-none')
                this.colExcluir.classList.remove('d-none')

                listaItemsConsult.forEach((v) => {
                    let rowConsult = tableConsult.insertRow()

                    //cria as colunas          
                    switch(v.tipo){
                        case '1':
                            v.tipo = 'Café da manhã'
                            break
                        case '2':
                            v.tipo = 'Lanche'
                            break
                        case '3':
                            v.tipo = 'Jantar'
                            break
                        case '4':
                            v.tipo = 'Limpeza'
                            break
                        case '5':
                            v.tipo = 'Bebida'
                            break
                        case '6':
                            v.tipo = 'Utensílios'
                            break
                    }
                    rowConsult.insertCell(0).innerHTML = v.tipo
                    rowConsult.insertCell(1).innerHTML = v.descricao
       
                    //criar os btns finalizar e excluir
                    //btn finalizar
                    let btnFinalizar = document.createElement('button')
                    btnFinalizar.className = ('btn btn-warning btn-sm')
                    btnFinalizar.id = 'btn-finalizar'
                    btnFinalizar.innerHTML = '<i class="fas fa-check"></i>'

                    //passa para funcao o item que vai ser finalizado
                    btnFinalizar.addEventListener('click', () => this.trocarStatus(v.id))
        
                    rowConsult.insertCell(2).append(btnFinalizar)

                     //verifica se o item esta finalizado
                     if(v.statusFinalizado){
                        rowConsult.classList.add('finalizada') // Adiciona a classe à linha
                        btnFinalizar.className =('btn btn-success btn-sm')
                    }

                    //btn excluir
                    let btnExcluir = document.createElement('button')
                    btnExcluir.className = ('btn btn-danger btn-sm')
                    btnExcluir.id = 'btn-excluir'
                    btnExcluir.innerHTML = '<i class="fas fa-times"></i>'

                    rowConsult.insertCell(3).append(btnExcluir)

                    //passa para funcao o item que vai ser excluido
                    btnExcluir.addEventListener('click', () => this.remover(v.id))
                }) 
            } else{
                this.toast('Nenhum item cadastrado','#FF0000')

                // Oculta os cabeçalhos
                this.colFinalizar.classList.add('d-none')
                this.colExcluir.classList.add('d-none')
            }   
            
            //exibir e esconder o btn de limpar
            let tdConsult = this.tableConsult.querySelectorAll('tr').length > 0
    
            if(tdConsult){
                this.btnClear.classList.remove('d-none')
                this.btnClear.classList.add('block')
            }else{
                this.btnClear.classList.remove('block')
                this.btnClear.classList.add('d-none')
            }
        }
    }

    limparConsulta(){
        let colRemove = document.querySelector('#col-remove')
        let colFinaly = document.querySelector('#col-finaly')

        //esconde as colunas
        colRemove.classList.add('d-none')
        colFinaly.classList.add('d-none')

        //limpa a tabela
        this.tableConsult.innerHTML = ''

        //esconder o botao de limpar
        this.btnClear.classList.remove('block')
        this.btnClear.classList.add('d-none')

        //limpa os inputs
        this.inpTipoPesquisa.value = ''
        this.inpDescricaoPesquisa.value = ''
    }

    //remover do localStorage
    remover(id){
        let items = JSON.parse(localStorage.getItem('item')) || []
        
        items = items.filter(item => item.id !== id )
        localStorage.setItem('item', JSON.stringify(items))
        this.toast('Item removido com sucesso!', '#008000')
        this.exibirNaTabela()
    }

    //msg de aviso
    toast(txt, color){
        Toastify({
            text: txt,
            duration: 2500, 
            close: true, 
            gravity: "top", 
            position: "center", 
            backgroundColor: color, 
            }).showToast();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const item = new gerenciarApp()
    item.registrarEventos()
    if(item.indexPage){
        item.exibirNaTabela()
    }
})



