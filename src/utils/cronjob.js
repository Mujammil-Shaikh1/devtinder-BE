const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest")

cron.schedule(" * * * * *", async () => {

  const yesterDay = subDays(Date.now(), 1);
  const yesterDayOfStart = startOfDay(yesterDay);
  const yesterDayOfEnd = endOfDay(yesterDay);
  try {
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      // createdAt: {
      //   $gte: yesterDayOfStart,
      //   $lt: yesterDayOfEnd
      // }
    }).populate("fromUserId toUserId").limit(3)
    // console.log("pendingRequest",newpendingRequests);

    const emailIds = [...new Set(pendingRequests.map(user => user.toUserId.email))];
    console.log("emaildIds", emailIds);


  } catch (err) {
    console.log(err);
  }
})