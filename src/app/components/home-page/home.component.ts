import { Component } from "@angular/core";
import { Quiz } from './Quiz.model';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'Home',
    templateUrl: './home.html'
})

export class Home {

    quiz: Quiz[];
    currentQuestion: Quiz;
    selectedOption: String = null;
    recorderdOption: any[] = new Array<any>();
    questionIndex: number = 0;
    submitted: boolean = false;

    constructor(
        private http: HttpClient,
    ) {
        this.quiz = new Array<Quiz>();
        this.currentQuestion = new Quiz();
        this.currentQuestion.incorrect_answers = new Array<String>();
    }

    ngOnInit() {
        this.getQuestions();
    }

    getQuestions() {
        this.http.get(`https://opentdb.com/api.php?amount=10&type=multiple`)
            .subscribe(
                res => {
                    this.quiz = res['results'];
                    this.quiz.forEach(x => {
                        x.incorrect_answers.push(x.correct_answer);
                        x.incorrect_answers = this.shuffle(x.incorrect_answers);
                    })

                    this.currentQuestion = this.quiz[0];
                }
            )
    }

    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    optionChange(event) {
        this.selectedOption = event;
        let answer = {
            index: this.questionIndex,
            option: this.selectedOption,
            question: this.currentQuestion.question
        }

        if (this.recorderdOption.findIndex(x => x.index == this.questionIndex) > -1)
            this.recorderdOption[this.recorderdOption.findIndex(x => x.index == this.questionIndex)] = answer;
        else
            this.recorderdOption.push(answer)

    }

    nextQuestion() {
        ++this.questionIndex;
        this.selectedOption = null;
        this.currentQuestion = new Quiz();
        Object.assign(this.currentQuestion, this.quiz[this.questionIndex]);
        this.getMarkedAnswer();
    }

    previousQuestion() {
        --this.questionIndex;
        this.selectedOption = null;
        this.currentQuestion = new Quiz();
        Object.assign(this.currentQuestion, this.quiz[this.questionIndex]);
        this.getMarkedAnswer();
    }

    getMarkedAnswer() {
        let answer = this.recorderdOption.find(x => x.index == this.questionIndex);
        if (answer)
            this.selectedOption = answer.option;
    }

    isNextBtnActive() {
        return this.quiz.length - 1 == this.questionIndex ? false : true;
    }

    isPreviousBtnActive() {
        return this.questionIndex == 0 ? false : true;
    }

    submitQuiz() {
        if (confirm('Submit quiz?')) {

            let correctAnswer = 0;

            this.recorderdOption.forEach(x => {
                // if (x.answer == this.quiz[x.index].correct_answer)
                //     correctAnswer++;
                this.quiz.forEach(q => {
                    if (x.question == q.question) {
                        if (x.option == q.correct_answer)
                            correctAnswer++;
                    }
                })
            })

            alert(`your score : ${correctAnswer} / ${10}`)
            this.submitted = true;
            // this.resetQuizData();
        }
    }

    resetQuizData() {
        this.quiz = new Array<Quiz>();
        this.currentQuestion = new Quiz();
        this.currentQuestion.incorrect_answers = new Array<String>();

        this.selectedOption = null;
        this.recorderdOption = new Array<any>();
        this.questionIndex = 0;
    }

}