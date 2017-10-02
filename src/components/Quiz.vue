/**
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

<template>
    <div class="quiz">
        <div class="freeze"></div>
        <div class="loadingWrapper">
            <div>
                <div><img src="../assets/Blocks.gif"></div>
                <div class="message"></div>
                <button class="start" v-on:click="start">
                    start
                </button>
            </div>
        </div>
        <div class="quizWrapper">
            <div class="questionWrapper">
                <div class="subtitleWrapper">
                    <span class="subtitle"></span>
                </div>
                <div class="title"></div>
                <div class="question"></div>
                <iframe class="gistWrapper" v-on:load="resizeIframe" src=""></iframe>
            </div>

            <div class="answerWrapper">
                <div class="answer">
                    <input type="radio" id="answer1" name="samegroup" v-on:click="postAnswer">
                    <label for="answer1">
                    </label>
                </div>
                <div class="answer">
                    <input type="radio" id="answer2" name="samegroup" v-on:click="postAnswer">
                    <label for="answer2">
                    </label>
                </div>
                <div class="answer">
                    <input type="radio" id="answer3" name="samegroup" v-on:click="postAnswer">
                    <label for="answer3">
                    </label>
                </div>
                <div class="answer">
                    <input type="radio" id="answer4" name="samegroup" v-on:click="postAnswer">
                    <label for="answer4">
                    </label>
                </div>
                <div class="admin">
                    <div class="countDown"></div>
                    <button class="next" v-on:click="goToNext">
                        next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'quiz',
    beforeCreate: function() {
        var checkLocation = function() {
            if (!localStorage.getItem("user.userid")) {
                this.$router.push("/");
                return;
            }
            firebase.database().ref('quizNo').on('value', function(snapshot) {
                let currentQuizNo = snapshot.val();
                console.log("currentQuizNo:" + currentQuizNo)
                console.log("this.$route.params.id:" + this.$route.params.id)
                if (currentQuizNo == this.$route.params.id) {
                    return;
                }
                this.$router.push("/quiz/" + currentQuizNo, function(){location.reload()});
            }.bind(this));
        }.bind(this);
        window.addEventListener("popstate", checkLocation);
        checkLocation();
    },
    mounted: function() {
        firebase.database().ref('/quiz/' + this.$route.params.id).once('value').then(function(snapshot) {
            let quiz = snapshot.val();
            this.$el.querySelector(".start").style.display = "none";
            if(!quiz) {
                if(this.$route.params.id == 0){
                    if (this.isAdmin()){
                        this.$el.querySelector(".start").style.display = "block";
                    }
                    this.$el.querySelector(".message").innerHTML = "Please wait untill we start..";
                } else if (this.$route.params.id == 8) {
                    this.$el.querySelector(".message").innerHTML = "DONE!";
                }
                return;
            }
            this.$el.querySelector(".title").innerHTML = this.escapeHTML(quiz.title);
            this.$el.querySelector(".subtitle").innerHTML = this.escapeHTML(quiz.subtitle);
            this.$el.querySelector(".question").innerHTML = this.escapeHTML(quiz.question);
            if (quiz.gist) {
                this.$el.querySelector(".gistWrapper").src = "/static/" + quiz.gist + ".html";
            } else {
                this.$el.querySelector(".gistWrapper").style.display = "none";
            }
            Object.keys(quiz.answer).map(key => {
                console.log(this.$el);
                this.$el.querySelector("#" + key + " + label").innerHTML = this.escapeHTML(quiz.answer[key]);
                console.log(this.$el);
                this.$el.querySelector("#" + key + " + label").style.display = "block";
            });
            this.showQuestion();
        }.bind(this));

        if (this.isAdmin()){
            this.$el.querySelector(".admin").style.display = "block";
            let timer = setInterval(function(){
                let currentTime = this.$el.querySelector(".countDown").innerHTML;
                if(!currentTime) {
                    this.$el.querySelector(".countDown").innerHTML = 90 + "s left..";
                    return;
                }
                currentTime = currentTime.replace("s left..", "");
                if(currentTime <= 0){
                    firebase.database().ref('/').update({
                        freeze: true
                    });
                    clearInterval(timer);
                    return;
                }
                this.$el.querySelector(".countDown").innerHTML = --currentTime + "s left..";
            }.bind(this), 1000);
        } else {
            firebase.database().ref('freeze').on('value', function(snapshot) {
                let freeze = snapshot.val();
                console.log("freeze:" + freeze)
                if (!freeze) {
                    this.$el.querySelector(".freeze").style.display = "none";    
                    return;
                }
                this.$el.querySelector(".freeze").style.display = "block";    
            }.bind(this));
        }
    },
    methods: {
        resizeIframe: function(obj) {
            obj.currentTarget.style.height = obj.currentTarget.contentWindow.document.body.scrollHeight + 'px';

        },
        showQuestion: function(obj) {
            this.$el.querySelector(".loadingWrapper").style.display = "none";
            this.$el.querySelector(".quizWrapper").style.display = "block";
        },
        postAnswer: function(obj) {
            firebase.database().ref('users/' + localStorage.getItem("user.userid").replace(".", "dot")
                            .replace("$","dollar")
                            .replace("[","bracket")
                            .replace("]","bracket")
                            .replace("#","hash")
                            .replace("/","slash")
            + "/answers/question" + this.$route.params.id).set({
                answer: obj.target.id
            });
        },
        escapeHTML: function(string) {
            if(typeof string !== 'string') {
                return string;
            }
            return string.replace(/[&'`"<>]/g, function(match) {
                return {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
                }[match]
            });
        },
        goToNext: function(obj) {
            let nextQuizNo = this.$route.params.id++;
            firebase.database().ref('/').update({
                quizNo: nextQuizNo
            });
            firebase.database().ref('/').update({
                freeze: false
            });
        },
        isAdmin: function(){
            return localStorage.getItem("user.userid") == "uskay@google.com";
        },
        start: function() {
            let nextQuizNo = this.$route.params.id++;
            firebase.database().ref('/').update({
                quizNo: nextQuizNo
            });
        }
    }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.admin {
    display: none;
}
.freeze {
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #000;
    opacity: 0.8;
    position: fixed;
    top: 0px;
    left: 0px;
    display: none;
}

.loadingWrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
}
.loadingWrapper .message{
    color: #FFF;
    text-align: center;
}

.quizWrapper {
    display: none;
}
.countDown {
    position: relative;
    margin-top:50px;
    font-size: 3.0em;
    color: #FFF;
    font-weight: bold;
    text-align: center;
}
.questionWrapper {
    width: 90%;
    max-width: 600px;
    margin: 0 auto;
    margin-top: 130px;
    font-size: 1.5em;
    line-height: 1.5;
    position: relative;
}

.questionWrapper .subtitleWrapper {
    height: 30px;
    background-color: transparent;
    color: #FFF;
    font-size: 0.8em;
    position: absolute;
    top: -40px;
}

.questionWrapper .subtitle {
    padding-left: 25px;
    padding-right: 10px;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8dGl0bGU+CiAgICBPdmFsCiAgPC90aXRsZT4KICA8cGF0aCBkPSJNOCAxNmMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHpNMy4xNzIgNi4zNDNMMS43NTcgNy43NTcgNiAxMmw3LjA3LTcuMDctMS40MDItMS40MDRMNi4wMSA5LjE4MmwtMi44MzgtMi44NHoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4K) 0px center no-repeat;
}

.questionWrapper .title {
    color: #FFF;
    font-weight: 700;
}

.questionWrapper .question {
    color: #00BFA3;
    font-size: 0.8em;
    margin-top: 5px;
    margin-bottom: 20px;
}

.questionWrapper .gistWrapper {
    width: 100%;
    height: 100%;
    border: none;
}

.answerWrapper {
    max-width: 600px;
    width: 90%;
    margin: 10px auto;
    font-size: 1.2em;
}

.answerWrapper .answer {
    width: 100%;
    margin-bottom: 10px;
}

input[type=radio] {
    display: none;
}

input[type=radio]:checked+label {
    background-color: #00BFA3;
    color: #FFF;
}

label {
    width: 95%;
    padding-top: 10px;
    padding-bottom: 10px;
    display: block;
    background-color: transparent;
    margin: 0 auto;
    text-align: center;
    line-height: 1.6;
    color: #FFF;
    border-bottom: 1px solid #888;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 1px solid #FFF;
    border-radius: 3px;
    display: none;
}

label:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, .5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

@keyframes ripple {
    0% {
        transform: scale(0, 0);
        opacity: 1;
    }
    20% {
        transform: scale(30, 30);
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: scale(100, 100);
    }
}

input[type=radio]:checked+label::after {
    animation: ripple 1s ease-out;
}

.next {
    margin: 0 auto;
    width: 100%;
    height: 50px;
    border-radius: 5px;
    border: none;
    font-size: 1.2em;
    background-color: #00BFA3;
    color: #FFF;
    margin-top: 20px;
    cursor:pointer;
}
.start {
    width: 100px;
    height: 50px;
    border-radius: 5px;
    border: none;
    font-size: 1.2em;
    background-color: #555;
    color: #FFF;
    margin: 0 auto;
    margin-top: 30px;
    cursor:pointer;
    display: none;
}
</style>
