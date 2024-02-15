import Input from '../view/Input.js';
import Output from '../view/Output.js';
import CarNamesValidator from '../utils/CarNamesValidator.js';
import TryCountValidator from '../utils/TryCountValidator.js';
import Console from '../utils/Console.js';
import Random from '../utils/Random.js';
import Car from '../model/Car.js';
import Condition from '../constant/Condition.js';
import Message from '../constant/Message.js';

const { SEPERATOR } = Condition;
const { OUTPUT } = Message;

class Game {
  async startGame() {
    const cars = await Console.errorHandler(this.getCars);
    const tryCount = await Console.errorHandler(this.getTryCount);

    this.playGame(cars, tryCount);

    Output.winnerResult(this.calculateWinner(cars));
  }

  async getCars() {
    const carNames = await Input.inputCarName();
    const cars = carNames.split(SEPERATOR).map((car) => new Car(car));

    CarNamesValidator.isValidCount(cars);
    CarNamesValidator.isDuplicate(cars);

    return cars;
  }

  async getTryCount() {
    const tryCount = await Input.inputTryCount();

    TryCountValidator.isNaturalNumber(Number(tryCount));

    return tryCount;
  }

  playGame(cars, tryCount) {
    console.log(OUTPUT.result);

    for (let i = 0; i < tryCount; i++) {
      this.playRound(cars);
    }
  }

  playRound(cars) {
    this.calculateAdvance(cars);
    Output.roundResult(cars);
  }

  calculateAdvance(cars) {
    cars.forEach((car) => {
      const randomNumber = Random.pickNumberZeroToNine();
      car.updateAdvance(randomNumber);
    });
  }

  calculateWinner(cars) {
    const maxAdvance = Math.max(...cars.map((car) => car.getAdvance()));
    return cars.filter((car) => car.getAdvance() === maxAdvance);
  }
}

export default Game;
