export default (states, defaultSpeed = 100 * 1024, tickCallback, finishCallback) => {

  let current = 0;
  let timeout = null;

  const handleTick = () => {
    tickCallback(states[current]);


    const timeOfThisState = states[current].time;

    current += 1;

    if (states[current]) {
      const timeOfNextState = states[current].time;
      const delayBetween = timeOfNextState - timeOfThisState;
      timeout = setTimeout(handleTick, delayBetween);
    }
    else {
      console.info('playback finished');
      finishCallback && finishCallback();
    }
  };

  return {
    play() {
      console.info('playback started');
      clearTimeout(timeout); //if muptiple plays...
      handleTick();
    },
    stop() {
      clearTimeout(timeout);
      console.info('playback stopped');
    }

  }
}
