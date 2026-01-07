

let produtos = [
    {id: 1, produto: 'Cupcake', preco: 3.25,  quantidade:0, img: './Assets/imagens/cupcake.jpg', descricao: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis, amet!'},
    {id: 2, produto: 'Brigadeiro', preco: 2.00, quantidade:0, img: './Assets/imagens/brigadeiro.jpg', descricao: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis, amet!'},
    {id: 3, produto: 'Petit Gateau', preco: 7.50, quantidade:0, img: './Assets/imagens/petit.jpg', descricao: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis, amet!'},
    {id: 4, produto: 'Bolo de Morango', preco: 8.00, quantidade:0, img: './Assets/imagens/boloMorango.jpg', descricao: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis, amet!'},
    {id: 5, produto: 'X cake', preco: 10.00, quantidade:0, img: './Assets/imagens/xcake.jpg', descricao: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis, amet!'},
    {id: 6, produto: 'Torta de maçã', preco: 5.00, quantidade:0, img: './Assets/imagens/torta-de-maca.png', descricao: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis, amet!'}
]


let container = document.querySelector('main')

produtos.forEach(produto =>{
    const card = `
    <article class = "cardDoces">
        <div class = "imgCard">
            <img src = ${produto.img}>
        </div>    
        <div class = "contentCard">
            <h2>${produto.produto}</h2>
            <p>${produto.descricao}</p>
            <div class = "precoCarrinho">
                <p class = "preco">R$ ${produto.preco.toFixed(2)}</p>
                <button class= "btnCarrinho" data-id = "${produto.id}"><i class="fa-solid fa-cart-shopping"></i>
                </button>
            <div class = "btnAddRemover escondido">
                <button class = "remover">-</button>
                <span class = "spanQtd">0</span>
                <button class = "add">+</button>
            </div>
        </div>    
        </div>
        </article>`
        
        container.innerHTML += card
})
/* const btnCarrinho = document.querySelectorAll('.btnCarrinho')
const btnAddRemover = document.querySelectorAll('.btnAddRemover')
let spanQtd = document.querySelector('.spanQtd')
 */

let carrinho = []

function salvarCarrinho(){
    const produtosEmTexto = JSON.stringify(carrinho)
    localStorage.setItem('carrinho', produtosEmTexto)
}

function carregarCarrinho(){
    const produtosEmObj = localStorage.getItem('carrinho')
    if(!produtosEmObj) return
    
    carrinho = JSON.parse(produtosEmObj)

    carrinho.forEach(item =>{
        let pOriginal = produtos.find(elemento => elemento.id === item.id)


        if(pOriginal){
            pOriginal.quantidade = item.quantidade
        }
    })

    alterarSpan()
    renderizarTotal()
    atualizarVitrine()
}



const cards = document.querySelectorAll('.cardDoces')
cards.forEach(card =>{
    let btnCarrinho = card.querySelector('.btnCarrinho')
    let btnAddRemover = card.querySelector('.btnAddRemover')
    const btnMais = card.querySelector('.add')
    const btnMenos = card.querySelector('.remover')
    let span = btnAddRemover.querySelector('.spanQtd')
    
    
    btnCarrinho.addEventListener('click', () =>{
        

        let id = Number(btnCarrinho.dataset.id)
        btnCarrinho.classList.toggle('escondido')
        btnAddRemover.classList.toggle('escondido')
        
        let objEncontrado = produtos.find(elemento => elemento.id === id) 
        addCarrinho(objEncontrado)
        console.log(carrinho)
        span.textContent = objEncontrado.quantidade
    })
    
    btnMais.addEventListener('click', () =>{

    
        let id = Number(btnCarrinho.dataset.id)
        let encontrado = carrinho.find(elemento => elemento.id === id)

        if(encontrado){
            encontrado.quantidade ++
            span.textContent = encontrado.quantidade
            alterarSpan()
            salvarCarrinho()

        }
    })

    btnMenos.addEventListener('click', () =>{
        let id  = Number(btnCarrinho.dataset.id)

        let encontrado = carrinho.find(elemento => elemento.id === id)

        if(encontrado){
        if(encontrado.quantidade > 1){
            encontrado.quantidade --
            span.textContent = encontrado.quantidade
            alterarSpan()
            renderizarTotal()
            salvarCarrinho()
        }else{
            encontrado.quantidade --
            btnCarrinho.classList.toggle('escondido')
            btnAddRemover.classList.toggle('escondido')
            carrinho = carrinho.filter(elemento => elemento.id !== id)
            
            let produtoEcontrado = produtos.find(p => p.id === id)

            if(produtoEcontrado){
                produtoEcontrado.quantidade = 0
            }

            let teste = carrinho.reduce((acc, {quantidade})=>{
                return acc + quantidade
            },0)

           
            spanQtd_header.textContent = teste
            renderizarTotal()
            salvarCarrinho()
           
        }
    }
    })
})

function addCarrinho(objEncontrado){
    objEncontrado.quantidade ++
    let quantidade = objEncontrado.quantidade

    let obj = {
        id: objEncontrado.id,
        produto: objEncontrado.produto,
        preço: objEncontrado.preco,
        quantidade: quantidade,
        img: objEncontrado.img
    }

    if(!carrinho.includes(objEncontrado.id)){

        carrinho.push(obj)
        alterarSpan()
        renderizarTotal()
        salvarCarrinho()
    }
}


const paginaCarrinho = document.querySelector('.paginaCarrinho')
const btnExcluir = document.querySelector('.btnExcluir')
const paginaCarrinho_container = document.querySelector('.paginaCarrinho_container')
paginaCarrinho.addEventListener('click', (e)=>{
    
    if(e.target.classList.contains('fa-trash-can')){
        e.stopPropagation()
         let id = Number(e.target.dataset.id)
       excluir(id)
       return
    }
})


const modalCarrinho = document.querySelector('.modalCarrinho')
const modalCarrinho_content = document.querySelector('.modalCarrinho_content')
modalCarrinho.addEventListener('click', (e) =>{
    if(!modalCarrinho_content.contains(e.target)){
        modalCarrinho.classList.add('escondido')
    }
})
const fechar = document.querySelector('.fechar')
let spanQtd_header = document.querySelector('.spanQtd_header')

function alterarSpan(){
let spanTotal = carrinho.reduce((acc, itemAtual)=>{
    let quantidade = itemAtual.quantidade
   return acc + quantidade
     
},0)

spanQtd_header.textContent = spanTotal

}
fechar.addEventListener('click', () =>{
    modalCarrinho.classList.toggle('escondido')
})

const btnCarrinhoHeader = document.querySelector('.btnCarrinho_header')
btnCarrinhoHeader.addEventListener('click', () =>{
    modalCarrinho.classList.toggle('escondido')
    paginaCarrinho.innerHTML = ''
    renderizarCarrinho()
})




function excluir(id){
    carrinho = carrinho.filter(elemento => elemento.id !== id)
    console.log(carrinho)

    let produtoEcontrado = produtos.find(p => p.id === id)
    if(produtoEcontrado){
        produtoEcontrado.quantidade = 0
    }

    alterarSpan()
    zerarBtnCarrinho(id)
    renderizarCarrinho()
    renderizarTotal()
    salvarCarrinho()

}

function renderizarCarrinho(){
    paginaCarrinho.innerHTML = ''
    
    carrinho.forEach(c=>{
        let total = c.quantidade * c.preço
        const cardCarrinho = `
        <div class = 'paginaCarrinho_container'>
        <div class = "imgCarrinho_container">
        <img class = "imgCarrinho" src = "${c.img}">
        </div>
        <div class = 'paginaCarrinho_content'>
        <h3>${c.produto}</h3>
        <span class="spanTotalCarrinho">Total: R$${total.toFixed(2)}</span>
        <span class="spanQtdCarrinho">Quantidade: ${c.quantidade}</span>
        
        <div class="btnEditarExcluir">
            <div class="containerEditar">
                <div class="containerMaisMenos escondido">
                    <button data-id="${c.id}" class="btnMenosCarrinho">-</button>
                    <button data-id="${c.id}" class="btnMaisCarrinho">+</button>
                </div>
            </div>
                <button data-id="${c.id}" class="btnEditar "><i data-id="${c.id}" class="fa-regular fa-pen-to-square"></i></button>
        <button  class="btnExcluir"><i data-id="${c.id}" class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>
        
        
        
        </div
        
        
        </div>
            
        
        </div>`
        
        paginaCarrinho.innerHTML += cardCarrinho
    })
}
function renderizarTotal(){
    let totalCarrinho = document.querySelector('.totalCarrinho')
    let valorTotal = total()
    if(valorTotal === 0){
        totalCarrinho.classList.add('escondido')
    }else{
        totalCarrinho.classList.remove('escondido')
        totalCarrinho.innerHTML = ''
        let totalCompra = `<div class="contentTotalCarrinho">
        <h3>Total: R$${valorTotal.toFixed(2)}</h3>
                <button class="btnComprar">Comprar</button>
                </div>
                `
                totalCarrinho.innerHTML = totalCompra
                salvarCarrinho()
                
                let btnComprar = document.querySelector('.btnComprar')
                btnComprar.addEventListener('click', comprar)
                
                
            }    
        }
        
        function comprar(){
            let compraRealizada = document.querySelector('.compraRealizada')
            let totalCarrinho = document.querySelector('.totalCarrinho')

            totalCarrinho.classList.add('escondido')
            paginaCarrinho.classList.add('escondido')
            compraRealizada.style.display = 'block'
            
            setTimeout(()=>{
                compraRealizada.style.display = 'none'
                paginaCarrinho.classList.remove('escondido')
            }, 4000)

        limparTudo()
        alterarSpan()
        renderizarTotal()
        renderizarCarrinho()
        atualizarVitrine()

            
    
} 

function limparTudo(){
    produtos.forEach(p => p.quantidade = 0)

    carrinho= []

    localStorage.removeItem('carrinho')

    limparVitrine()
}

function limparVitrine(){
    const todosBtnCarrinho = document.querySelectorAll('.btnCarrinho');
    const todosBtnAddRemover = document.querySelectorAll('.btnAddRemover');
    const todosSpansQtd = document.querySelectorAll('.spanQtd');

    todosBtnCarrinho.forEach(btn => btn.classList.remove('escondido'))

    todosBtnAddRemover.forEach(btn => btn.classList.add('escondido'))

    todosSpansQtd.forEach(span => span.textContent = '0')
}


function zerarBtnCarrinho(id){
    
    let btnsCarrinho = document.querySelectorAll('.btnCarrinho')
        
    let btnCarrinhoAtual = Array.from(btnsCarrinho).find(btn => btn.dataset.id === id.toString())
    let pai = btnCarrinhoAtual.closest('.contentCard')
    let btnAddRemover = pai.querySelector('.btnAddRemover')
    let span = pai.querySelector('.spanQtd')

    btnCarrinhoAtual.classList.toggle('escondido')
    btnAddRemover.classList.toggle('escondido')
    span.textContent = 0

}






paginaCarrinho.addEventListener('click', (e) =>{
    let card = e.target.closest('.paginaCarrinho_container')
    if(!card) return

    let btnEditar = card.querySelector('.btnEditar')
    let containerMaisMenos = card.querySelector('.containerMaisMenos')
    let btnMaisCarrinho = card.querySelector('.btnMaisCarrinho')
    let btnMenosCarrinho = card.querySelector('.btnMenosCarrinho')
    let id = Number(e.target.dataset.id) 

    if(e.target.classList.contains('fa-pen-to-square')){
        editar(btnEditar, containerMaisMenos)
        return
    }
    
    if(e.target === btnMaisCarrinho){
        somarCarrinho(id, btnMaisCarrinho)
        
        return
    }
        
    if(e.target === btnMenosCarrinho){
        subtrairCarrinho(id, btnMenosCarrinho)
        
        return
    }
        
    if(!containerMaisMenos.contains(e.target)){
        esconderCarrinho(btnEditar, containerMaisMenos)
        return
    }

})


function editar(btnEditar, containerMaisMenos){
    
    /* let btnEncontrado = Array.from(btnEditar).find(btn=> btn.dataset.id === id.toString()) */
    
    btnEditar.classList.toggle('escondido')
    containerMaisMenos.classList.toggle('escondido')
}

function esconderCarrinho(btnEditar, containerMaisMenos){
    
    btnEditar.classList.remove('escondido')
    containerMaisMenos.classList.add('escondido')
}

function somarCarrinho(id, btnMaisCarrinho){

    let pai = btnMaisCarrinho.closest('.paginaCarrinho_container')
    const spanQtdCarrinho = pai.querySelector('.spanQtdCarrinho')
    const spanTotalCarrinho = pai.querySelector('.spanTotalCarrinho')
    let btnMenosCarrinho = pai.querySelector('.btnMenosCarrinho')
    btnMenosCarrinho.disabled === false
    let cardVitrine = document.querySelector(`.btnCarrinho[data-id="${id}"]`).closest('.contentCard')

    let span = cardVitrine.querySelector('.spanQtd')

    let encontrado = carrinho.find(elemento => elemento.id === id)
    if(encontrado){
        encontrado.quantidade ++
        let valorTotal = encontrado.quantidade * encontrado.preço
        alterarSpan() 

    spanTotalCarrinho.textContent = `Total: R$${valorTotal.toFixed(2)}`
    spanQtdCarrinho.textContent = `Quantidade: ${encontrado.quantidade}`
    span.textContent = encontrado.quantidade
    renderizarTotal()
    salvarCarrinho()
    
   }
}

function subtrairCarrinho(id, subtrairCarrinho){

    let pai = subtrairCarrinho.closest('.paginaCarrinho_container')
    const spanQtdCarrinho = pai.querySelector('.spanQtdCarrinho')
    const spanTotalCarrinho = pai.querySelector('.spanTotalCarrinho')
    let btnMenosCarrinho = pai.querySelector('.btnMenosCarrinho')
    let spanVitrine = document.querySelector(`.btnCarrinho[data-id ="${id}"]`).closest('.contentCard')
    let span = spanVitrine.querySelector('.spanQtd')

    let encontrado = carrinho.find(elemento => elemento.id === id)
    if(encontrado.quantidade === 1){
        btnMenosCarrinho.disabled === true
        btnMenosCarrinho.classList.add('disabled')
    }else{
        btnMenosCarrinho.classList.remove('disabled')
        

    
    encontrado.quantidade --
    alterarSpan()

    let valorTotal = encontrado.quantidade * encontrado.preço
    
    spanTotalCarrinho.textContent = `Total: R$${valorTotal.toFixed(2)}`
    spanQtdCarrinho.textContent = `Quantidade: ${encontrado.quantidade}`
    span.textContent = encontrado.quantidade
    renderizarTotal()
    salvarCarrinho()
        
    }
}

function total(){
  let quantidadeTotal = carrinho.reduce((acc, {quantidade, preço}) =>{
    let total = quantidade * preço
    return acc + total
  }, 0)
  
  return quantidadeTotal
  
}

function atualizarVitrine(){
    carrinho.forEach(item =>{
        const btnCarrinho = document.querySelector(`.btnCarrinho[data-id = "${item.id}"]`)

        if(btnCarrinho){
            const pai = btnCarrinho.closest('.contentCard');
            const btnAddRemover = pai.querySelector('.btnAddRemover');
            const spanQtd = pai.querySelector('.spanQtd');

            btnCarrinho.classList.add('escondido');
            btnAddRemover.classList.remove('escondido');
            spanQtd.textContent = item.quantidade;
        }
    })
}


carregarCarrinho()