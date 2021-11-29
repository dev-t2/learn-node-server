type Resolve = (value: string) => void;
type Reject = (error: Error) => void;

const work = (ms: number) => {
  return new Promise((resolve: Resolve, reject: Reject) => {
    const date = new Date().toISOString();

    setTimeout(() => {
      resolve(date);
      // reject(new Error(`에러 발생: ${date}`));
    }, ms);
  });
};

work(1000)
  .then((date) => {
    console.log(`첫 번째 작업: ${date}`);

    return work(1000);
  })
  .then((date) => {
    console.log(`두 번째 작업: ${date}`);
  })
  .catch((e: Error) => {
    console.error(e.message);
  });