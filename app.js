class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
    }

    validarDados () {
        for(let i in this) {
            if (this[i] === null || this[i] === undefined || this[i] === '') {
                return false
            }
        } return true
    }
}

class Bd {
    constructor (){
        let id = localStorage.getItem('id') 
        if (id === null) {
            localStorage.setItem('id', 0)
        } 
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1

    }

    gravar(d) { // JSON.parse() = converte uma string JSON para objeto literal
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d)) // JSON.stringify() = converte um objeto literal para uma string JSON
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        
        let despesas = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) { // Funcionando

        let despesasFiltradas = Array()

        
        despesasFiltradas = this.recuperarTodosRegistros() // Tem todos os itens

        // Ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)  
        }
        
        // Dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        
        // Mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)            
        }
        
        // Tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)            
        }
        
        // Descrição
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)            
        }
        
        // Valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)            
        }        
        
        let path =  window.location.pathname.split('/')

        if (path[path.length-1] == 'indicadores.html') {
            let array = Array()
            array.push(despesasFiltradas)
            let valor = 0
            for(let i = 0; i < despesasFiltradas.length; i++) {
                valor += parseFloat(despesasFiltradas[i].valor)
            }
            array.push(valor)

            return array
        }
        
        return despesasFiltradas   

    }


    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()

function cadastrarDispesa() {
    
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if(despesa.validarDados()) {
        bd.gravar(despesa)
        // Dialog de sucesso
        $('#modalRegistraDespesa').modal('show')
        document.getElementById("text-color").className += ' text-success' // Cor do texto do modal
        document.getElementById("exampleModalLabel").innerHTML = "Registro inserido com sucesso" // Texto do modal           
        document.getElementById("descricao-modal").innerHTML = "Dados salvos com sucesso!"            
        document.getElementById("button-modal").className += ' btn-success' // Classe do botão do modal

        // Limpando os campos após o envio
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''


    } else {
        // Dialog de erro
        $('#modalRegistraDespesa').modal('show')        
        document.getElementById("text-color").className += ' text-danger'   
        document.getElementById("exampleModalLabel").innerHTML = "Falha ao enviar os registros"  
        document.getElementById("descricao-modal").innerHTML = "Existe campos que não foram preenchidos. Preencha antes de enviar." 
        document.getElementById("button-modal").innerHTML += ' e consertar'
        document.getElementById("button-modal").className += ' btn-danger'
    }
}

function carregarListasDespesas(despesas = Array(), filter = false) {


    if (despesas.length == 0 && filter == false) {
        despesas = bd.recuperarTodosRegistros()

    } else if (despesas.length == 2) {

        var valor = despesas[1]
        var despesas = despesas[0]
    }
    
    let path =  window.location.pathname.split('/')
    if (path[path.length-1] == 'indicadores.html') { // Mostrar o valor total

        let titulo = document.getElementById('gastos-text').innerHTML
        
        titulo = titulo.split('Total')

        if (titulo.length == 2) {
            document.getElementById('gastos-text').innerHTML = 'Gastos mensais'
        }

        if (valor == undefined) {
            valor = ''
        } else {
            valor = '<br>Total: R$' + valor
        }
        document.getElementById('gastos-text').innerHTML += valor
    }


    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    if(despesas)

    despesas.forEach(function(d) {

        // Criando a linha (tr)
        let linha = listaDespesas.insertRow()
        
        // Criando as colunas (td)        
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
            break
            case '2': d.tipo = 'Educação'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Saúde'
            break
            case '5': d.tipo = 'Transporte'
            break           
        }
        
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        // Criar o botão de exclusão       
        if (path[path.length-1] == 'consulta.html') {
            let btn = document.createElement("button")
            btn.className = 'btn btn-danger'
            btn.innerHTML = '<i class="fas fa-times"></i>'
            btn.id = `id_despesa_${d.id}`
            btn.onclick = function () {
                
                let id = this.id.replace('id_despesa_', '')
                bd.remover(id)
    
                window.location.reload() // Atualizar a página
    
            }
            linha.insertCell(4).append(btn)

        }
         
        
        
    })
}


function pesquisarDespesas() {

    
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor) // Funcionando

    
    let despesas = bd.pesquisar(despesa) // Funcionando

    //console.log(bd.valorTotal(despesa))

    carregarListasDespesas(despesas, true)
}
