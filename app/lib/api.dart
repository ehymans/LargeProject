import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

const String url = "https://progress-tracker-4331-88c53c23c126.herokuapp.com";

Future<void> addTask(String id, String taskName, String taskDescription,
    String taskDifficulty) async {
  Map data = {
    "userId": id,
    "taskName": taskName,
    "taskDescription": taskDescription,
    "taskDifficulty": taskDifficulty,
  };

  const Map<String, String> header = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  };

  var jsonData = jsonEncode(data).toString();
  var response;
  response = await http.post(Uri.parse("$url/api/addTask"),
      body: jsonData, headers: header);
  if (response.statusCode == 200) {
    print('Task added');
  } else {
    print('Failed to add task');
  }
}
