// import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';
import 'task.dart';

const String url = "https://dare2do.online";

Future<String> signIn(String login, String password) async {
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

  var receivedData = json.decode(response.body);
  var token = receivedData["accessToken"];
  if (response.statusCode == 200) {
    // print(response.body.toString() == '{"error":"Login/Password incorrect"}');
    if (response.body.toString() == '{"error":"Login/Password incorrect"}') {
      print('Login failed');
      return "0";
    } else {
      print('Login successful');
      return token;
    }
  } else {
    print('failed');
    return "0";
  }
}

Future<int> registerUser(String firstName, String lastName, String login,
    String email, String password) async {
  Map data = {
    "first name": firstName,
    "last name": lastName,
    "username": login,
    "email": email,
    "password": password
  };

  final bool passValid =
      RegExp(r"^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$").hasMatch(password);

  if (!passValid) {
    print('Invalid Password');
    return 3;
  } else {
    var jsonData = jsonEncode(data);
    var response = await http.post(Uri.parse("$url/api/register"),
        body: jsonData, headers: {'Content-type': 'application/json'});
    print(response.statusCode);
    print(response.body);
    if (response.statusCode == 200) {
      print(data);
      print('Register successful');
      return 1;
    } else {
      print('Register failed');
      return 0;
    }
  }
}

Future<void> addTask(String id, String taskName, String taskDescription,
    String taskDifficulty, String token) async {
  Map data = {
    "userId": id,
    "taskName": taskName,
    "taskDescription": taskDescription,
    "taskDifficulty": taskDifficulty,
    "taskCompleted": false,
    "accessToken": token
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

Future<List<Task>> displayTasks(String id, String token) async {
  Map uData = {"userId": id, "search": "", "accessToken": token};

  var jsonData = jsonEncode(uData).toString();

  const Map<String, String> header = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  };

  var response = await http.post(Uri.parse("$url/api/searchtasks"),
      body: jsonData, headers: header);

  List<Task> result = [];

  var results = jsonDecode(response.body);
  print(results);
  final data = results["results"] as List;
  int length = data.length;

  for (int i = 0; i < length; i++) {
    Task temp = Task();
    temp.taskId = results["results"][i]["_id"];
    temp.taskName = results["results"][i]["TaskName"];
    temp.taskDescription = results["results"][i]["TaskDescription"];
    temp.taskDifficulty = results["results"][i]["TaskDifficulty"];
    if (results["results"][i]["TaskCompleted"] == false) {
      temp.taskCompleted = false;
    } else {
      temp.taskCompleted = true;
    }
    temp.date = results["results"][i]["Date"];
    result.add(temp);
  }

  return result;
}

Future<void> updateTask(Task task, String token) async {
  Map data = {
    "_id": task.taskId,
    "taskName": task.taskName,
    "taskDescription": task.taskDescription,
    "taskDifficulty": task.taskDifficulty,
    "TaskCompleted": task.taskCompleted,
    "accessToken": token
  };

  var jsonData = jsonEncode(data).toString();

  const Map<String, String> header = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  };

  var response = await http.post(Uri.parse("$url/api/updatetask"),
      body: jsonData, headers: header);
  var results = jsonDecode(response.body);
  print(results);
}

Future<User> userTasks(String userId) async {
  var data = {"userId": userId};

  var jsonData = jsonEncode(data).toString();
  const Map<String, String> header = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  };

  var response = await http.post(Uri.parse("$url/api/usertasks"),
      body: jsonData, headers: header);
  var results = jsonDecode(response.body);
  print(results);

  User user = User();
  user.userId = userId;
  user.tasksInProgress = results["tasksInProgress"];
  user.tasksCompleted = results["tasksCompleted"];

  return user;
}

Future<int> verifyEmail(String email) async {
  final bool emailValid = RegExp(r"^\S+@\S+\.\S+$").hasMatch(email);

  if (emailValid) {
    var verification;
    verification = await http.get(Uri.parse("$url/api/getcode/$email"));

    var response;
    if (verification.statusCode == 200) {
      print("Verification Email sent");
      response = jsonDecode(verification.body);
      print(response);
      return int.parse(response["code"]);
    } else {
      return 0;
    }
  } else {
    return 1;
  }
}
