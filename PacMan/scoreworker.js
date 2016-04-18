var score = parseInt(0);
var finish = false;
var timeRemaining = 60;
var totalScore = 0;

onmessage = function (event)
{
    switch (event.data.toLowerCase())
    {
        case "pill":
            score += 1;
            break;
        case "bigpill":
        case "biscuit":
            score += 3;
            break;
        case "fruit":
            score += 5;
            break;
        case "second":
            timeRemaining -= 1;
            break;
        case "finish":
            finish = true;
            break;
    }
    if (finish)
    {
        totalScore = score + timeRemaining;
    } else
    {
        totalScore = score;
    }
    postMessage(totalScore);
}
