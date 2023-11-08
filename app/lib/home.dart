import 'package:flutter/material.dart';
import 'api.dart';

class HomeScreen extends StatefulWidget {
  //const HomeScreen({Key? key}) : super(key: key);
  const HomeScreen({super.key, required this.login});

  final String login;

  @override
  HomeScreenState createState() => HomeScreenState();
}

List<DropdownMenuItem<String>> get dropdownItems {
  List<DropdownMenuItem<String>> menuItems = [
    DropdownMenuItem(child: Text("Easy"), value: "Easy"),
    DropdownMenuItem(child: Text("Medium"), value: "Medium"),
    DropdownMenuItem(child: Text("Hard"), value: "Hard"),
  ];
  return menuItems;
}

class HomeScreenState extends State<HomeScreen> {
  TextEditingController taskNameController = TextEditingController();
  TextEditingController taskDescriptionController = TextEditingController();
  TextEditingController taskDifficultyController = TextEditingController();

  List<String> difficulty = ['Easy', 'Medium', 'Hard'];
  String? selectedDifficulty = 'Easy';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dare2Do Home Page'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              controller: taskNameController,
              decoration: InputDecoration(hintText: 'Task Name'),
            ),
            SizedBox(height: 20),
            TextFormField(
              controller: taskDescriptionController,
              decoration: InputDecoration(hintText: 'Task Description'),
            ),
            SizedBox(height: 40),
            DropdownButton<String>(
              items: dropdownItems,
              value: selectedDifficulty,
              onChanged: (item) => setState(() => selectedDifficulty = item),
            ),
            GestureDetector(
              onTap: () async {
                addTask(
                    widget.login,
                    taskNameController.text.toString(),
                    taskDescriptionController.text.toString(),
                    selectedDifficulty.toString());
              },
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(10)),
                child: Center(child: Text('Add Task')),
              ),
            )
          ],
        ),
      ),
    );
  }
}
