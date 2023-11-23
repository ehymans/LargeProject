import 'package:flutter/material.dart';

class Task {
  String taskId = "";
  String taskName = "";
  String taskDescription = "";
  String taskDifficulty = "";
  bool taskCompleted = false;
  String date = "";
}

Color taskColor(String priority) {
  if (priority == "Low") {
    return Colors.green;
  } else if (priority == "Medium") {
    return Colors.amber;
  } else if (priority == "High") {
    return Colors.red;
  } else {
    return Colors.black;
  }
}

class User {
  String userId = "";
  int tasksInProgress = 0;
  int tasksCompleted = 0;
}

int calculateLevel(int tasksInProgress, int tasksCompleted) {
  if (tasksInProgress >= 1 && tasksCompleted >= 0) {
    return 1;
  } else if (tasksCompleted >= 2 && tasksCompleted < 5) {
    return 2;
  } else if (tasksCompleted >= 5 && tasksCompleted < 10) {
    return 3;
  } else if (tasksCompleted >= 10) {
    return 4;
  } else {
    return 0;
  }
}

double calculateProgress(int tasksInProgress, int tasksCompleted, int level) {
  double progress = 0;

  print(level);
  if (level == 0) {
    if (tasksInProgress > 0) {
      progress = 100;
    } else {
      progress = 0;
    }
  } else if (level == 1) {
    progress = (tasksCompleted / 2.0) * 100;
    // print('LEVEL 1');
    // print(progress);
  } else if (level == 2) {
    progress = ((tasksCompleted - 2) / 3.0) * 100;
  } else if (level == 3) {
    progress = ((tasksCompleted - 5) / 5.0) * 100;
  } else {
    progress = 0;
  }
  ;

  return (progress / 100.0);
}
