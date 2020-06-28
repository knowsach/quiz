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

                    this.currentQuestion = this.quiz[0];
                    console.log('quizes:', res, this.quiz, this.currentQuestion);
                }
            )
    }

    optionChange(event) {
        this.selectedOption = event;
        let answer = {
            index: this.questionIndex,
            option: this.selectedOption
        }

        if (this.recorderdOption.findIndex(x => x.index == this.questionIndex) > -1)
            this.recorderdOption[this.recorderdOption.findIndex(x => x.index == this.questionIndex)] = answer;
        else
            this.recorderdOption.push(answer)

        console.log('answer : ', this.recorderdOption);
    }

    submitQuiz() {

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


}