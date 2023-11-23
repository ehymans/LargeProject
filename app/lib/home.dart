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
        backgroundColor: Color(0xFFB71F1F),
        title: const Text('Dare2Do'),
        titleTextStyle: TextStyle(
            fontFamily: "Courier New",
            fontWeight: FontWeight.w600,
            fontSize: 30),
        automaticallyImplyLeading: false,
        leading: ElevatedButton(
          style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFB71F1F), elevation: 0),
          onPressed: () async {
            if (!mounted) return;
            List<Task> taskList =
                await displayTasks(widget.login, widget.token);
            User newUser = await userTasks(widget.login);
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => TaskScreen(
                      taskList: taskList,
                      login: widget.login,
                      token: widget.token,
                      user: newUser)),
            );
          },
          child: Icon(Icons.home, color: Colors.white),
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFB71F1F), elevation: 0),
            onPressed: () {
              // print("ADD");
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Welcome to the Add Task Page!')),
              );
            },
            child: Icon(Icons.add, color: Colors.white),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFB71F1F), elevation: 0),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => Login(title: "Dare2DO"),
                ),
              );
            },
            child: Icon(Icons.exit_to_app, color: Colors.white),
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
                      //color: Colors.white,
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.all(Radius.circular(5))),
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
                      style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFB71F1F),
                          elevation: 0),
                      onPressed: () async {
                        addTask(
                            widget.login,
                            taskNameController.text.toString(),
                            taskDescriptionController.text.toString(),
                            selectedDifficulty.toString(),
                            widget.token);
                        taskNameController.text = "";
                        taskDescriptionController.text = "";
                        selectedDifficulty = "Low";
                      },
                      child: Text("Submit Task",
                          style: TextStyle(color: Colors.white)),
                    ),
                  ),
                ],
              ),
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
      required this.token,
      required this.user});

  final String login;
  final String token;
  final List<Task> taskList;
  final User user;

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

  // bool isCompleted = false;

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    int inProgress = widget.user.tasksInProgress;
    int completed = widget.user.tasksCompleted;
    int level = calculateLevel(inProgress, completed);
    double progress = calculateProgress(inProgress, completed, level);
    // String percent = (progress * 100).toString();
    print(progress);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFFB71F1F),
        title: const Text('Dare2Do'),
        titleTextStyle: TextStyle(
            fontFamily: "Courier New",
            fontWeight: FontWeight.w600,
            fontSize: 30),
        automaticallyImplyLeading: false,
        leading: ElevatedButton(
          style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFB71F1F), elevation: 0),
          onPressed: () async {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Welcome to the Home Page!')),
            );
          },
          child: Icon(Icons.home, color: Colors.white),
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFB71F1F), elevation: 0),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      HomeScreen(login: widget.login, token: widget.token),
                ),
              );
            },
            child: Icon(color: Colors.white, Icons.add),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFB71F1F), elevation: 0),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => Login(title: "Dare2DO"),
                ),
              );
            },
            child: Icon(Icons.exit_to_app, color: Colors.white),
          ),
        ],
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
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Container(
                  height: 120,
                  width: size.width * 0.5,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(5),
                    color: Color(0x32325df2),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("Tasks In Progress: $inProgress",
                                style: TextStyle(
                                    color: Colors.white, fontSize: 20)),
                            Text("Tasks Completed: $completed",
                                style: TextStyle(
                                    color: Colors.white, fontSize: 20)),
                            Text("Level: $level",
                                style: TextStyle(
                                    color: Colors.white, fontSize: 20))
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(30.0),
                        child: SizedBox(
                          height: 125,
                          width: 125,
                          child: Center(
                            child: CircularProgressIndicator(
                              backgroundColor: Color(0xFFB71F1F),
                              value: progress,
                              valueColor: AlwaysStoppedAnimation(Colors.green),
                              strokeWidth: 10,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: SizedBox(
                  height: size.height * 0.9,
                  child: ListView.separated(
                    itemCount: tList.length,
                    itemBuilder: (context, index) {
                      Color color = taskColor(tList[index].taskDifficulty);
                      //bool isCompleted = tList[index].taskCompleted;
                      return SizedBox(
                        width: size.width,
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Container(
                            width: size.width * 0.5,
                            height: 200,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius:
                                  BorderRadius.all(Radius.circular(5)),
                              // border: Border.all(width: 2, color: Colors.black)
                            ),
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
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text("Completed?"),
                                      Checkbox(
                                        value: tList[index].taskCompleted,
                                        activeColor: Colors.blue,
                                        checkColor: Colors.white,
                                        onChanged: (value) {
                                          setState(
                                            () {
                                              tList[index].taskCompleted =
                                                  value!;
                                              // Task newTask = Task();
                                              // newTask.taskId = tList[index].taskId;
                                              // newTask.taskName = tList[index].taskName;
                                              // newTask.taskDescription =
                                              //     tList[index].taskDescription;
                                              // newTask.taskDifficulty =
                                              //     tList[index].taskDifficulty;
                                              // newTask.taskCompleted =
                                              //     tList[index].taskCompleted;
                                              updateTask(
                                                  tList[index], widget.token);
                                            },
                                          );
                                        },
                                      )
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                    separatorBuilder: (BuildContext context, int index) {
                      return Divider();
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
