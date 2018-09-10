
let listaCartas = [
  {nome: 'america', img: 'img/america.png'},
  {nome: 'Atletico Mineiro', img: 'img/atletico-mg.png'},
  {nome: 'Atletico Paranaense', img: 'img/atletico-pr.png'},
  {nome: 'bahia', img: 'img/bahia.png'},
  {nome: 'botafogo', img: 'img/botafogo.png'},
  {nome: 'ceara', img: 'img/ceara.png'},
  {nome: 'chapecoense', img: 'img/chapecoense.png'},
  {nome: 'Corinthians', img: 'img/corinthians.png'},
  {nome: 'cruzeiro', img: 'img/cruzeiro.png'},
  {nome: 'flamengo', img: 'img/flamengo.png'},
  {nome: 'fluminense', img: 'img/fluminense.png'},
  {nome: 'gremio', img: 'img/gremio.png'},
  {nome: 'internacional', img: 'img/internacional.png'},
  {nome: 'palmeiras', img: 'img/palmeiras.png'},
  {nome: 'parana', img: 'img/parana.png'},
  {nome: 'santos', img: 'img/santos.png'},
  {nome: 'São Paulo', img: 'img/sao-paulo.png'},
  {nome: 'Sport', img: 'img/sport.png'},
  {nome: 'Vasco', img: 'img/vasco.png'},
  {nome: 'Vitoria', img: 'img/vitoria.png'}
]
let lockBoard = false
let firstCard, secondCard
let hasFlippedCard = false
let acertos = 0
let level, jogador
let tempo = 0
let tentativas = 0
function checkForMatch () {
  tentativas = tentativas + 1
  let combinou = firstCard.dataset.time === secondCard.dataset.time
  if (combinou) {
    emitSound('correto')
    disableCards()
    acertos++
    checkWin()
  } else {
    emitSound('erro')
    unflipCards()
  }
}
function checkWin () {
  if (level / 2 === acertos) {
    alert('Parabens, você venceu!')
    const dataUser = {
      nome: jogador,
      tempo: tempo,
      tentativas: tentativas
    }
    window.localStorage.setItem(jogador, JSON.stringify(dataUser))
    location.reload()
  }
}
function disableCards () {
  firstCard.removeEventListener('click', virar)
  secondCard.removeEventListener('click', virar)

  resetBoard()
}

function emitSound (result) {
  if (result === 'correto') {
    const audio = document.getElementById('audioAcerto')
    return audio.play()
  } else {
    const audio = document.getElementById('audioErro')
    return audio.play()
  }
}

function unflipCards () {
  lockBoard = true
  setTimeout(() => {
    firstCard.classList.remove('vira')
    secondCard.classList.remove('vira')

    resetBoard()
  }, 1500)
}

function resetBoard () {
  [hasFlippedCard, lockBoard] = [false, false]
  [firstCard, secondCard] = [null, null]
}

function createCard (carta) {
  let newCard = document.createElement('div')
  newCard.setAttribute('data-time', carta.nome)
  newCard.setAttribute('class', 'carta')
  newCard.addEventListener('click', virar)
  let cardImg = document.createElement('img')
  cardImg.setAttribute('src', carta.img)
  cardImg.setAttribute('alt', carta.nome)
  cardImg.setAttribute('class', 'front-face')
  newCard.appendChild(cardImg)
  cardImg = document.createElement('img')
  cardImg.setAttribute('src', 'img/hidden.png')
  cardImg.setAttribute('alt', carta.nome)
  cardImg.setAttribute('class', 'back-face')
  newCard.appendChild(cardImg)
  return newCard
}

function mountedTabuleiro () {
  let cards = document.getElementById('all-cards')
  for (let i = 0; i < (level / 2); i++) {
    cards.appendChild(createCard(listaCartas[i]))
    cards.appendChild(createCard(listaCartas[i]))
  }
  embaralha()
  return true
}

function embaralha () {
  const cartas = document.querySelectorAll('.carta')
  cartas.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12)
    card.style.order = randomPos
  })
}
(function createPlacar () {
  document.getElementById('placar').style.display = 'none'
  let listPlayers = []
  for (let i = 0; i < localStorage.length; i++) {
    var name = localStorage.key(i)
    var value = JSON.parse(localStorage[name])
    const player = {
      nome: name,
      tempo: value.tempo,
      tentativas: value.tentativas
    }
    listPlayers.push(player)
    document.getElementById('listPlayers').innerHTML += '<b>' + player.nome + '</b> =>' + ' ' + player.tempo + ' segundos e ' + player.tentativas + ' tentativas <br>'
  }
  listPlayers = orderRecords(listPlayers)
  const firstPlayer = listPlayers[0]
  if (firstPlayer) {
    document.getElementById('recorde').innerHTML = '<br> Melhor Pontuador: <br>' + '<b>' + firstPlayer.nome + '</b> <br>' + '  tentativas:' + firstPlayer.tentativas + ' tempo:' + firstPlayer.tempo
  }
})()
function orderRecords (listPlayers) {
  return listPlayers.sort(function (a, b) { return a.tempo - b.tempo })
}
function startGame (form) {
  if (!(form.nivel.value && form.jogador.value)) {
    return alert('Preencha todos os campos')
  }
  document.getElementById('placar').style.display = 'block'
  setInterval(contGame, 1000)
  document.getElementById('all-cards').style.display = 'flex'
  document.getElementById('form-start').style.display = 'none'
  level = form.nivel.value
  jogador = form.jogador.value
  mountedTabuleiro()
  return false
}
function contGame () {
  tempo = ++tempo
  document.getElementById('cronometro').innerHTML = tempo
}
function virar () {
  if (lockBoard) return
  if (this === firstCard) return
  this.classList.add('vira')
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true
    firstCard = this

    return
  }
  secondCard = this
  checkForMatch()
}
document.getElementById('all-cards').style.display = 'none'
