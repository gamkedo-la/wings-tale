function drawLevelCompleteScreen(level) {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.textAlign = "center";

  //  Completed level
  context.fillText(
    "Level  " + level + ":",
    canvas.width / 2,
    canvas.height / 2 - 12
  );
  context.fillText("COMPLETE", canvas.width / 2, canvas.height / 2 + 12);

  // Deaths
  if (deathCount != 0) {
    context.fillText(
      "Hits Taken: " + deathCount + " = " + "-" + deathCount * 1000 + " points",
      canvas.width / 2,
      canvas.height / 2 + 30
    );
  } else {
    context.fillText(
      "No Hits Taken! = 10,000 bonus points",
      canvas.width / 2,
      canvas.height / 2 + 30
    );
  }

  // Score
  context.fillText(
    "Score: " + playerScore,
    canvas.width / 2,
    canvas.height / 2 + 48
  );
}

function drawLevelTransitionScreen(level) {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.textAlign = "center";

  // Next Level
  context.fillText(
    "Level " + (level + 1) + ":",
    canvas.width / 2,
    canvas.height / 2 - 12
  );
  context.fillText(
    levNames[level].toUpperCase().replace("LEVEL ", ""),
    canvas.width / 2,
    canvas.height / 2 + 12
  );
}
