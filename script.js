const personagem = document.querySelector('.img_char');
const background = document.querySelector('.img_fundo');
const pontuacao = document.querySelector('.pontos');
const somPulo = document.getElementById("somPulo");
const somPulo_chegando = document.getElementById("somPulo_chegando");
const morcego = document.getElementById("morcego");
const hit = document.getElementById("hit");
const iconSom = document.querySelector('.som');
const iconTrilha = document.querySelector('.trilha');
const trilha = document.getElementById("trilha");
const fim = document.getElementById("gameOver");
const ovo = document.getElementById("ovo");
const pauseInterface = document.getElementById("pause");

let som = true;
let trilhaSonora = true;
let numVidas = 3;
let morto = false;
let seMovendo = false;
let posicao = 0;
let pontos = 0;
let pause = false;

trilha.currentTime = 0;
trilha.play();

function ativaTrilha() {
    trilhaSonora = trilhaSonora == true ? false : true;
    if (trilhaSonora) {
        trilha.currentTime = 0;
        trilha.play();
        iconTrilha.classList.remove("trilhaOff");
        iconTrilha.classList.add("trilhaOn");
    } else {
        trilha.currentTime = 0;
        trilha.pause();
        iconTrilha.classList.remove("trilhaOn");
        iconTrilha.classList.add("trilhaOff");
    }
}

function pausaTodosSom() {
    trilha.pause();
    ativaSom();
}

function playTodosSom() {
    if (trilhaSonora) {
        trilha.play();
    }
    ativaSom();
}

function ativaSom() {
    som = som == true ? false : true;
    if (som) {
        iconSom.classList.remove("somOff");
        iconSom.classList.add("somOn");
    } else {
        iconSom.classList.remove("somOn");
        iconSom.classList.add("somOff");
    }
}

function playGame() {
    pause = false;
    pauseInterface.style.display = "None";
    playTodosSom()
}

function pauseGame() {
    pause = true;
    pauseInterface.style.display = "block";
    pausaTodosSom();
}

function trataBotaoApertado(event) {
    if (event.code === "Escape" && !morto) {
        if (!pause) {
            pauseGame();
        } else {
            playGame();
        }
    } else if (event.code === "Space" || event.type == 'touchstart') {
        if (!seMovendo && morto == false && !pause) {
            pulo();
        } else if (morto == true) {
            document.location.reload();
        }
    } else if (event.code === "KeyS" && !morto && !pause) {
        ativaSom();
    } else if (event.code === "KeyD" && !morto && !pause) {
        ativaTrilha();
    }
}

function pulo() {

    if (trilha.paused && trilhaSonora) {
        trilha.currentTime = 0;
        trilha.play();
    }

    if (som) {
        somPulo.currentTime = 0;
        somPulo.play();
    }

    seMovendo = true;
    let intervaloPulo = setInterval(function () {
        if (posicao >= 150) {
            clearInterval(intervaloPulo);
            let descendo = setInterval(function () {
                if (posicao <= 0) {
                    clearInterval(descendo);
                    seMovendo = false;

                    if (som) {
                        somPulo_chegando.currentTime = 0;
                        somPulo_chegando.play();
                    }
                } else {
                    if (!pause) {
                        posicao -= 8;
                        personagem.style.bottom = posicao + "px";
                    }
                }
            }, 20);
        } else {
            if (!pause) {
                posicao += 8;
                personagem.style.bottom = posicao + "px";
            }
        }
    }, 20);
}

function criarInimigo() {
    let posicaoInimigo = 1000;
    let tempoAleatorio = Math.random() * 6000;
    let velocidade = 5;

    if (pause || morto) {

    } else {
        const Inimigo = document.createElement('div');

        if (pontos > 5) {
            velocidade = pontos;
        }

        if (tempoAleatorio < 1000) {
            tempoAleatorio = 1000;
        }

        Inimigo.classList.add("Inimigo");

        if (pontos < 5) {
            Inimigo.classList.add("egg");
        } else {
            Inimigo.classList.add("morcego");
        }

        Inimigo.style.left = 1000 + 'px';
        background.appendChild(Inimigo);

        let InimigoIntervalo = setInterval(function () {
            if (posicaoInimigo < -20) {
                clearInterval(InimigoIntervalo);
                background.removeChild(Inimigo);
                pontos++;
                pontuacao.innerHTML = "<p class='num_pontos'>" + pontos + "</p>"
            } else if (posicaoInimigo > 0 && posicaoInimigo < 60 && posicao < 60) {
                //Tomou uma ratada
                let vida = document.getElementsByClassName('vida' + numVidas);
                numVidas--;
                if (vida[0]) {
                    vida[0].style.display = "none";
                }
                clearInterval(InimigoIntervalo);
                background.removeChild(Inimigo);
                if (numVidas == 0) {
                    trilha.pause();
                    somPulo.pause();
                    somPulo_chegando.pause();
                    hit.pause();

                    document.getElementsByClassName("img_fundo")[0].style.animation = "none";
                    personagem.style.display = "none";
                    fim.currentTime = 0;
                    fim.play();

                    window.setInterval(() => document.body.innerHTML = "<div class='fimDeJogo'> <img src='img/game_over2.png' alt='game_over' class='game_over'><img src='img/sad_pug.gif' alt='sad_pug' class='sad_pug'><div  class='totalPontos'><h1>Total de pontos: </h1><p>" + pontos + "</p></div><p class='jogarNovamente'>Pressione ESPAÇO para jogar novamente</p></div><div class='rodape'><h2>Creditos</h2><div>Desenvolvedor: <a href='https://www.linkedin.com/in/danilo-saleth/'>Danilo Saleth</a></div><div>Trilha sonora: <a href='https://soundcloud.com/mota-o-marmota'>João Pedro Mota</a></div></div>", 4000);
                    morto = true;
                }
                if (!morto) {
                    if (som) {
                        hit.currentTime = 0;
                        hit.play();
                    }
                }
            } else {
                if(!pause){
                    posicaoInimigo -= velocidade;
                    Inimigo.style.left = posicaoInimigo + "px";
                }
            }
        }, 20);
    }
    if (!morto) {
        if (som) {
            if (pontos < 5) {
                ovo.currentTime = 0;
                ovo.play();
            } else {
                morcego.currentTime = 0;
                morcego.play();
            }

        }
        setTimeout(criarInimigo, tempoAleatorio);
    }

}
criarInimigo();
document.addEventListener('keydown', trataBotaoApertado);
document.addEventListener('touchstart', trataBotaoApertado);