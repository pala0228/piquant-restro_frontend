export default class TimeCalculator {
  /**
   * @ignore
   */
  static convertToMinsAndSeconds(sec: number) {
    const minutes: number = Math.floor(sec / 60);
    const seconds = sec - minutes * 60;
    let timeoutText: string;
    if (minutes <= 9) {
      timeoutText = "0" + minutes + ":";
    } else {
      timeoutText = minutes + ":";
    }
    if (seconds <= 9) {
      timeoutText = timeoutText + "0" + seconds;
    } else {
      timeoutText = timeoutText + seconds;
    }
    return timeoutText;
  }
  /**
   * @ignore
   */
  static convertToMinsAndReturnsMinsAndSeconds(sec: number) {
    const minutes: number = Math.floor(sec / 60);
    const seconds = sec - minutes * 60;
    let timeoutText: string;
    if (minutes <= 9) {
      timeoutText = "0" + minutes + " mins ";
    } else {
      timeoutText = minutes + " mins ";
    }

    if (seconds <= 9) {
      timeoutText = timeoutText + "0" + seconds + " secs ";
    } else {
      timeoutText = timeoutText + seconds + " secs ";
    }
    return timeoutText;
  }
  /**
   * @ignore
   */
  static minutesAndSecondsCounter(fromDate: Date) {
    let now = new Date();
    let distance = fromDate.getTime() - now.getTime();

    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let timeoutText: string;
    if (minutes <= 9) {
      timeoutText = "0" + minutes + ":";
    } else {
      timeoutText = minutes + ":";
    }
    if (seconds <= 9) {
      timeoutText = timeoutText + "0" + seconds;
    } else {
      timeoutText = timeoutText + seconds;
    }
    return timeoutText;
  }
  /**
   * @ignore
   */
  static convertToMins(sec: number) {
    const minutes: number = Math.floor(sec / 60);
    const seconds = sec - minutes * 60;
    if (minutes < 1 && seconds > 0) {
      return sec - minutes * 60 + " secs ";
    } else if (minutes > 0 && seconds < 1) {
      return minutes + " mins ";
    } else {
      return minutes + " mins " + seconds + " secs ";
    }
  }
}
