// import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

const String url = "https://dare2do.online";

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
    print(response.body);
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
