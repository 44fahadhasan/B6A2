import autoReturnCron from "./autoReturn.cron";

const startCronJobs = () => {
  autoReturnCron.start();
};

export default startCronJobs;
