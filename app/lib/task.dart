import 'package:flutter/material.dart';

class Task {
  String taskName = "";
  String taskDescription = "";
  String taskDifficulty = "";
  String taskCompleted = "";
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
