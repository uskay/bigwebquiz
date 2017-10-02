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
    <div class="odds">
        <div class="answer">
            <div class="bar">
                <div class="bet bet1"></div>
            </div>
            <div class="answerText"></div>
            <div class="percent"></div>
        </div>
        <div class="answer">
            <div class="bar">
                <div class="bet bet2"></div>
            </div>
            <div class="answerText"></div>
            <div class="percent"></div>
        </div>
        <div class="answer">
            <div class="bar">
                <div class="bet bet3"></div>
            </div>
            <div class="answerText"></div>
            <div class="percent"></div>
        </div>
        <div class="answer">
            <div class="bar">
                <div class="bet bet4"></div>
            </div>
            <div class="answerText"></div>
            <div class="percent"></div>
        </div>
        <button class="showText" v-on:click="showText">
            show
        </button>
    </div>
</template>

<script>
export default {
    name: 'odds',
    beforeCreate: function() {
        var checkLocation = function() {
            firebase.database().ref('quizNo').on('value', function(snapshot) {
                let currentQuizNo = snapshot.val();
                if (currentQuizNo == this.$route.params.id) {
                    return;
                }
                this.$router.push("/odds/" + currentQuizNo, function(){location.reload()});
                
            }.bind(this));
        }.bind(this);
        checkLocation();
    },
    mounted: function(obj){
        if(!this.isAdmin()){
            return;
        }
        let shuffule = function(a) {
            for (let i = a.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [a[i - 1], a[j]] = [a[j], a[i - 1]];
            }
        }
        let myArray = ["answer1", "answer2", "answer3", "answer4"];
        shuffule(myArray);
        let i = 0;
        console.log(this.$el.getElementsByClassName("answer"));
        Array.prototype.slice.call(this.$el.getElementsByClassName("answer")).map(obj => {
            obj.classList.add(myArray[i]);
            i++;
        })
        firebase.database().ref('quiz/' + this.$route.params.id + "/answer").once('value').then(function(snapshot) {
            let options = snapshot.val();
            let countAnswer = 0;
            Object.keys(options).map(key => {
                console.log(key);
                countAnswer++;
                this.$el.querySelector("." + key).style.display = "block";
                this.$el.querySelector("." + key + " .answerText").innerHTML = this.escapeHTML(options[key]);
            });
            this.$el.style.width = countAnswer * 300 + "px";
        }.bind(this));
        firebase.database().ref('users').on('value', function(snapshot) {
            let allusers = snapshot.val();
            let answerMap = {};
            let countUser = 0;
            Object.keys(allusers).map(key => {
                if(!allusers[key].answers){
                    return;
                }
                let q = allusers[key].answers["question" + this.$route.params.id];
                if(!q || !q.answer){
                    return;
                }
                countUser++;
                let answer = q.answer;
                let count = answerMap[answer];
                if(count){
                    answerMap[answer] = ++count;
                } else {
                    answerMap[answer] = 1;
                }
            })
            let keyList = {"answer1": "", "answer2": "", "answer3": "", "answer4": ""};
            Object.keys(answerMap).map(key => {
                delete keyList[key];
                console.log("start");
                console.log("key: " + key);
                this.$el.querySelector("." + key + " .bet").style.height = (answerMap[key]/countUser * 500) + "px";
                this.$el.querySelector("." + key + " .percent").innerHTML = Math.ceil((answerMap[key]/countUser * 100)) + "%";
            });
            Object.keys(keyList).map(key => {
                this.$el.querySelector("." + key + " .bet").style.height = "0px";
                this.$el.querySelector("." + key + " .percent").innerHTML = "0%";
            });
        }.bind(this));
    },
    methods: {
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
        showText: function(obj) {
            Array.prototype.slice.call(this.$el.getElementsByClassName("answerText")).map(obj => obj.style.display = "block")
        },
        isAdmin: function(){
            return localStorage.getItem("user.userid") == "uskay@google.com";
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.odds {
    width:1200px;
    margin: 0 auto;
    margin-top:150px;
    height:500px;
}
.answer {
    float: left;
    width:300px;
    display: none;
}
.answer .bar {
    height:500px;
    width:100px;
    position: relative;
    margin: 0 auto;    
}
.answer .bar .bet {
    width:100%;
    position: absolute;
    bottom: 0px;
    transition: height 1s;
    transition-timing-function: ease-in-out;
}
.answer .bar .bet1 {
    background-color: #FFCB2B;
}
.answer .bar .bet2 {
    background-color: #41B883;
}
.answer .bar .bet3 {
    background-color: #61DAFB;
}
.answer .bar .bet4 {
    background-color: #F8688A;
}
.answer .answerText {
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font-size: 1.5em;
    color: #FFF;
    display: none;
}
.answer .percent {
    width: 100%;
    margin-top: 20px;
    text-align: center;
    font-size: 3.0em;
    color: #FFF;
    font-weight: bold;
}
.showText {
    width: 100px;
    height: 50px;
    border-radius: 5px;
    border: none;
    font-size: 1.2em;
    background-color: #555;
    color: #FFF;
    margin-top: 50px;
    cursor:pointer;
    float:right;
}
</style>
