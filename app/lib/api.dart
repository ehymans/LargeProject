import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

const String url = "https://progress-tracker-4331-88c53c23c126.herokuapp.com";

Future<int> signIn(String login, String password) async {
  Map data = {
    "login": login,
    "password": password,
  };

  const Map<String, String> header = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  };

  var jsonData = jsonEncode(data).toString();
  var response;
  response = await http.post(Uri.parse("$url/api/login"),
      body: jsonData, headers: header);
  if (response.statusCode == 200) {
    //     print(response.body);
    // print(response.body.toString() == '{"error":"Login/Password incorrect"}');
    if (response.body.toString() == '{"error":"Login/Password incorrect"}') {
      print('Login failed');
      return 0;
    } else {
      print('Login successful');
      return 1;
    }
  } else {
    print('failed');
    return 0;
  }
}

Future<void> registerUser(
    String firstName, String lastName, String login, String password) async {
  Map data = {
    "first name": firstName,
    "last name": lastName,
    "username": login,
    "password": password
  };
  var jsonData = jsonEncode(data);
  var response = await http.post(Uri.parse("$url/api/register"),
      body: jsonData, headers: {'Content-type': 'application/json'});
  print(response.statusCode);
  print(response.body);
  if (response.statusCode == 200) {
    print(data);
    print('Register successful');
  } else {
    print('failed');
  }
}

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
