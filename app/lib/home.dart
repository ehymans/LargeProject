// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'api.dart';
import 'task.dart';
import 'main.dart';

class HomeScreen extends StatefulWidget {
  //const HomeScreen({Key? key}) : super(key: key);
  const HomeScreen({super.key, required this.login, required this.token});

  final String login;
  final String token;

  @override
  HomeScreenState createState() => HomeScreenState();
}

List<DropdownMenuItem<String>> get dropdownItems {
  List<DropdownMenuItem<String>> menuItems = [
    DropdownMenuItem(child: Text("Low"), value: "Low"),
    DropdownMenuItem(child: Text("Medium"), value: "Medium"),
    DropdownMenuItem(child: Text("High"), value: "High"),
  ];
  return menuItems;
}

class HomeScreenState extends State<HomeScreen> {
  TextEditingController taskNameController = TextEditingController();
  TextEditingController taskDescriptionController = TextEditingController();
  TextEditingController taskDifficultyController = TextEditingController();

  List<String> difficulty = ['Low', 'Medium', 'High'];
  String? selectedDifficulty = 'Low';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dare2Do'),
        titleTextStyle: TextStyle(
            fontFamily: "Courier New",
            fontWeight: FontWeight.w600,
            fontSize: 30),
        automaticallyImplyLeading: false,
        leading: ElevatedButton(
          onPressed: () async {
            // print("HERE IS OTHER LOGIN");
            // print(widget.login);
            if (!mounted) return;
            List<Task> taskList =
                await displayTasks(widget.login, widget.token);
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => TaskScreen(
                      taskList: taskList,
                      login: widget.login,
                      token: widget.token)),
            );
          },
          child: Icon(Icons.home),
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              // print("ADD");
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Welcome to the Add Task Page!')),
              );
            },
            child: Icon(Icons.add),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => Login(title: "Dare2DO"),
                ),
              );
            },
            child: Icon(Icons.exit_to_app),
          ),
        ],
      ),
      resizeToAvoidBottomInset: false,
      body: Container(
        decoration: BoxDecoration(
            gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF222233), Color(0xFF555577)])),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            // mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Text("Add a Task",
                    style: TextStyle(color: Colors.white, fontSize: 40)),
              ),
              TextFormField(
                controller: taskNameController,
                decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    labelText: 'Task Name'),
              ),
              SizedBox(height: 20),
              TextFormField(
                controller: taskDescriptionController,
                decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    labelText: 'Task Description'),
              ),
              SizedBox(height: 40),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 30),
                    child: Container(
                      color: Colors.white,
                      child: DropdownButton<String>(
                        items: dropdownItems,
                        value: selectedDifficulty,
                        onChanged: (item) =>
                            setState(() => selectedDifficulty = item),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 30),
                    child: ElevatedButton(
                      onPressed: () async {
                        addTask(
                            widget.login,
                            taskNameController.text.toString(),
                            taskDescriptionController.text.toString(),
                            selectedDifficulty.toString());
                        taskNameController.text = "";
                        taskDescriptionController.text = "";
                        selectedDifficulty = "Low";
                      },
                      child: Text("Submit Task"),
                    ),
                  ),
                ],
              ),
              // ElevatedButton(
              //   onPressed: () async {
              //     // print("HERE IS OTHER LOGIN");
              //     // print(widget.login);
              //     if (!mounted) return;
              //     List<Task> taskList =
              //         await displayTasks(widget.login, widget.token);
              //     Navigator.push(
              //       context,
              //       MaterialPageRoute(
              //           builder: (context) => TaskScreen(taskList: taskList)),
              //     );
              //   },
              //   style: ElevatedButton.styleFrom(
              //       backgroundColor: Color(0xFFff4b5c)),
              //   child: const Text('View Tasks'),
              // ),
            ],
          ),
        ),
      ),
    );
  }
}

class TaskScreen extends StatefulWidget {
  const TaskScreen(
      {super.key,
      required this.taskList,
      required this.login,
      required this.token});

  final String login;
  final String token;
  final List<Task> taskList;

  @override
  TaskScreenState createState() => TaskScreenState();
}

class TaskScreenState extends State<TaskScreen> {
  late List<Task> tList;
  @override
  void initState() {
    super.initState();
    tList = widget.taskList;
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        title: Text("Dare2Do Tasks"),
        titleTextStyle: TextStyle(
            fontFamily: 'Courier New',
            fontWeight: FontWeight.w600,
            fontSize: 40),
        backgroundColor: Color(0xFFff4b5c),
      ),
      resizeToAvoidBottomInset: false,
      body: SingleChildScrollView(
        child: Container(
          width: size.width,
          height: size.height,
          decoration: BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF222233), Color(0xFF555577)])),
          child: ListView.separated(
            itemCount: tList.length,
            itemBuilder: (context, index) {
              Color color = taskColor(tList[index].taskDifficulty);

              return Container(
                  child: SizedBox(
                width: size.width,
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Container(
                    width: size.width * 0.5,
                    height: 200,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(width: 2, color: Colors.black)),
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(tList[index].taskName,
                                style: TextStyle(
                                    fontFamily: 'Courier New',
                                    fontSize: 20,
                                    fontWeight: FontWeight.w600)),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(tList[index].taskDifficulty,
                                style: TextStyle(
                                    fontFamily: 'Courier New',
                                    fontSize: 20,
                                    fontWeight: FontWeight.w300,
                                    color: color)),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(tList[index].taskDescription,
                                style: TextStyle(
                                    fontFamily: 'Courier New',
                                    fontSize: 15,
                                    fontWeight: FontWeight.w300)),
                          ),
                        ]),
                  ),
                ),
              ));
            },
            separatorBuilder: (BuildContext context, int index) {
              return Divider();
            },
          ),
        ),
      ),
    );
  }
}
