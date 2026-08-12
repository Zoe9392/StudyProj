# Snake Project Local Development

## Table of Contents

- [Step 1: What the project is ?](#step-1)
- [Task 1:  create_default_game](#task-1)
- [Task 2: free_game()](#task-2)
- [Task3: print_board](#task-3)
- [Task 4](#task-4)
- [4.3: next square](#task-4-3)
- [Task 4.5: update_game (2026.08.03)](#task-4-5)
- [Task 5.1](#task-5-1)
- [Task 5:](#task-5)
- [Task 6 --- find_head and initialize_snakes](#task-6)
- [Task 6.2: initialize_snakes](#task-6-2)
- [Task 7: main](#task-7)
- [Integration tests](#integration-tests)
- [Notes](#final-notes)

---

<a id="step-1"></a>
## Step 1: What the project is ?





---

<a id="task-1"></a>
## Task 1:  create_default_game
Terminal: 
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
----------------------------------------------------------------------------
Still Segmentation Fault: 
  /* Initialize the snake_t struct */
  snake_t *new_snake = malloc(sizeof(snake_t)); 
  new_snake->tail_row = 2;
  new_snake->tail_col = 2;
  new_snake->head_row = 2;
  new_snake->head_col = 4;
  new_snake->live = true;

The correct updated version: 
new_game->snakes = malloc(sizeof(snake_t)); 
... ...


---

<a id="task-2"></a>
## Task 2: free_game()
My implementation: 
从大到小去free WRONG !!!
The terminal is like: 
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
In file included from src/unit_tests.c:8:
src/game.c: In function ‘free_game’:
src/game.c:86:14: warning: pointer ‘game’ may be used after ‘free’ [-Wuse-after-free]
   86 |     free(game->board[i]);
      |          ~~~~^~~~~~~
src/game.c:83:3: note: call to ‘free’ here
   83 |   free(game);
      |   ^~~~~~~~~~
src/game.c:88:12: warning: pointer ‘game’ used after ‘free’ [-Wuse-after-free]
   88 |   free(game->snakes);
      |        ~~~~^~~~~~~~
src/game.c:83:3: note: call to ‘free’ here
   83 |   free(game);
      |   ^~~~~~~~~~
src/game.c:85:35: warning: pointer ‘game’ used after ‘free’ [-Wuse-after-free]
   85 |   for(unsigned int i = 0; i < game->num_rows; i++){
      |                               ~~~~^~~~~~~~~~
src/game.c:83:3: note: call to ‘free’ here
   83 |   free(game);
      |   ^~~~~~~~~~
src/game.c:84:12: warning: pointer ‘game’ used after ‘free’ [-Wuse-after-free]
   84 |   free(game->board);
      |        ~~~~^~~~~~~
src/game.c:83:3: note: call to ‘free’ here
   83 |   free(game);
      |   ^~~~~~~~~~
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
-------------------------------------------------------------------------
Valgrind Memory check and detect: 

zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make valgrind-test-free-game
valgrind --leak-check=full --track-origins=yes ./unit-tests -m
==1704== Memcheck, a memory error detector
==1704== Copyright (C) 2002-2022, and GNU GPL'd, by Julian Seward et al.
==1704== Using Valgrind-3.22.0 and LibVEX; rerun with -h for copyright info
==1704== Command: ./unit-tests -m
==1704==
Reminder: These tests are not comprehensive, and passing them does not guarantee that your implementation is working.

Testing free_game...
This test case only checks for leaks in Tasks 1 and 2. Make sure that no Valgrind errors are printed!
==1704==
==1704== HEAP SUMMARY:
==1704==     in use at exit: 0 bytes in 0 blocks
==1704==   total heap usage: 22 allocs, 22 frees, 1,598 bytes allocated
==1704==
==1704== All heap blocks were freed -- no leaks are possible
==1704==
==1704== For lists of detected and suppressed errors, rerun with: -s
==1704== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)


---

<a id="task-3"></a>
## Task3: print_board

Terminal: 
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
In file included from src/unit_tests.c:8:
src/game.c: In function ‘print_board’:
src/game.c:115:7: warning: implicit declaration of function ‘fprinf’; did you mean ‘fprintf’? [-Wimplicit-function-declaration]
  115 |       fprinf(fp, game->board[i][j]);
      |       ^~~~~~
      |       fprintf
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
/usr/bin/ld: src/unit_tests.o: in function `print_board':
/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter/src/unit_tests.c:115:(.text+0x2f3): undefined reference to `fprinf'
collect2: error: ld returned 1 exit status
make: *** [Makefile:42: unit-tests] Error 1

zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
In file included from src/unit_tests.c:8:
src/game.c: In function ‘print_board’:
src/game.c:114:18: warning: multi-character character constant [-Wmultichar]
  114 |       fprintf(fp,'%c',game->board[i][j]);
      |                  ^~~~
src/game.c:114:18: warning: passing argument 2 of ‘fprintf’ makes pointer from integer without a cast [-Wint-conversion]
  114 |       fprintf(fp,'%c',game->board[i][j]);
      |                  ^~~~
      |                  |
      |                  int
In file included from src/unit_tests.c:2:
/usr/include/stdio.h:358:44: note: expected ‘const char * restrict’ but argument is of type ‘int’
  358 |                     const char *__restrict __format, ...) __nonnull ((1));
      |                     ~~~~~~~~~~~~~~~~~~~~~~~^~~~~~~~
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
-----------------------------------------------------------------------------
Adjusted: 
Google search and adjust and 





---

<a id="task-4"></a>
## Task 4
4.1 : Herlper Functions 
4.2 :

----------------------------------------------------------------------------

---

<a id="task-4-3"></a>
## 4.3: next square
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
In file included from src/unit_tests.c:8:
src/game.c: In function ‘next_square’:
src/game.c:275:23: warning: conversion to ‘int’ from ‘unsigned int’ may change the sign of the result [-Wsign-conversio]
  275 |   int curr_head_row = game->snakes[snum].head_row;
      |                       ^~~~
src/game.c:276:23: warning: conversion to ‘int’ from ‘unsigned int’ may change the sign of the result [-Wsign-conversio]
  276 |   int curr_head_col = game->snakes[snum].head_col;
      |                       ^~~~
src/game.c:277:39: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  277 |   char curr_head = get_board_at(game, curr_head_row, curr_head_col);
      |                                       ^~~~~~~~~~~~~
src/game.c:277:54: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  277 |   char curr_head = get_board_at(game, curr_head_row, curr_head_col);
      |                                                      ^~~~~~~~~~~~~
src/game.c:281:33: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  281 |       return get_board_at(game, curr_head_row, curr_head_col + 1);
      |                                 ^~~~~~~~~~~~~
src/game.c:281:62: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  281 |       return get_board_at(game, curr_head_row, curr_head_col + 1);
      |                                                ~~~~~~~~~~~~~~^~~
src/game.c:283:33: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  283 |       return get_board_at(game, curr_head_row, curr_head_col - 1);
      |                                 ^~~~~~~~~~~~~
src/game.c:283:62: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  283 |       return get_board_at(game, curr_head_row, curr_head_col - 1);
      |                                                ~~~~~~~~~~~~~~^~~
src/game.c:285:47: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  285 |       return get_board_at(game, curr_head_row + 1, curr_head_col);
      |                                 ~~~~~~~~~~~~~~^~~
src/game.c:285:52: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  285 |       return get_board_at(game, curr_head_row + 1, curr_head_col);
      |                                                    ^~~~~~~~~~~~~
src/game.c:287:47: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  287 |       return get_board_at(game, curr_head_row - 1, curr_head_col);
      |                                 ~~~~~~~~~~~~~~^~~
src/game.c:287:52: warning: conversion to ‘unsigned int’ from ‘int’ may change the sign of the result [-Wsign-conversio]
  287 |       return get_board_at(game, curr_head_row - 1, curr_head_col);
      |                                                    ^~~~~~~~~~~~~
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
-----------------------------------------------------
problems: unsigned int and int 
-----------------------------------------------------
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ ./unit-tests
Reminder: These tests are not comprehensive, and passing them does not guarantee that your implementation is working.

Testing create_default_game (Task 1)...
All create_default_game (Task 1) tests passed!

Testing print_board (Task 3)...
All print_board (Task 3) tests passed!

Testing next_square (Task 4)...
Assertion error: expected board width to be 25 but got 21
Error: next_square should not modify board
test_next_square_board_1 failed. Check unit-test-out.snk for a diagram of the board.
Not all next_square (Task 4) tests passed.
-------------------------------------------------------------------------------------------------
The logic and implementations of helper and this function are correct. The real bug is located at
Task 1: There is one requirement in the function I didn't really understand : 

   Each row of the board must be terminated by a new line character + null terminator and must  be a valid string.

---------------------------------------------------------------------------------------------------

---

<a id="task-4-5"></a>
## Task 4.5: update_game (2026.08.03)

Run the Tests:
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ ./unit-tests
Reminder: These tests are not comprehensive, and passing them does not guarantee that your implementation is working.

Testing create_default_game (Task 1)...
All create_default_game (Task 1) tests passed!

Testing print_board (Task 3)...
All print_board (Task 3) tests passed!

Testing next_square (Task 4)...
All next_square (Task 4) tests passed!

Testing update_head (Task 4)...
All update_head (Task 4) tests passed!

Testing update_tail (Task 4)...
All update_tail (Task 4) tests passed!

Testing update_game (Task 4)...
Assertion error: at (row 2, col 2), expected   but got d
test_update_game_board_1 failed. Check unit-test-in.snk, unit-test-out.snk, and unit-test-ref.snk.
Not all update_game (Task 4) tests passed.
---------------------------------------------------------------------------
Cursor Suggests: 
make clean 
make unit-tests
./unit-tests
But it gave a hint that no such directory 
---------------------------------------------------------------------------
cd /mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
gcc -c -o src/snake_utils.o src/snake_utils.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
gcc -c -o src/asserts.o src/asserts.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
./unit-tests
-----------------------------------------------------------------------------
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ ./unit-tests
Reminder: These tests are not comprehensive, and passing them does not guarantee that your implementation is working.

Testing create_default_game (Task 1)...
All create_default_game (Task 1) tests passed!

Testing print_board (Task 3)...
All print_board (Task 3) tests passed!

Testing next_square (Task 4)...
All next_square (Task 4) tests passed!

Testing update_head (Task 4)...
All update_head (Task 4) tests passed!

Testing update_tail (Task 4)...
All update_tail (Task 4) tests passed!

Testing update_game (Task 4)...
All update_game (Task 4) tests passed!

Testing read_line (Task 5)...
test_read_line_1 failed. Check the first line of tests/01-simple-in.snk for a diagram of the line.
Not all read_line (Task 5) tests passed.
--------------------------Resolved-------------------------------------------------------------------

---

<a id="task-5-1"></a>
## Task 5.1
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
In file included from src/unit_tests.c:8:
src/game.c: In function ‘read_line’:
src/game.c:397:24: warning: passing argument 1 of ‘fgets’ from incompatible pointer type [-Wincompatible-pointer-types]
  397 |   while((chars = fgets(fp)) != '\n' && chars != EOF){
      |                        ^~
      |                        |
      |                        FILE *
In file included from src/unit_tests.c:2:
/usr/include/stdio.h:654:38: note: expected ‘char * restrict’ but argument is of type ‘FILE *’
  654 | extern char *fgets (char *__restrict __s, int __n, FILE *__restrict __stream)
      |                     ~~~~~~~~~~~~~~~~~^~~
src/game.c:397:18: error: too few arguments to function ‘fgets’
  397 |   while((chars = fgets(fp)) != '\n' && chars != EOF){
      |                  ^~~~~
/usr/include/stdio.h:654:14: note: declared here
  654 | extern char *fgets (char *__restrict __s, int __n, FILE *__restrict __stream)
      |              ^~~~~
make: *** [Makefile:52: src/unit_tests.o] Error 1
  }
}
-----------------------------------------------------------------------------
AI suggested solution: to revise it 
re-read the prompt: 
-> read from a stream into the memory 
-> realloc 

Notes: 
Point 1: 

Function	                        Use case
fgetc(fp)               Read one character; good for building a line byte-by-byte
//(f-get-char : fgetc)
fgets(buf, n, fp)       Read up to n-1 chars into an existing buffer
//(f-get-string : fgets)

// char *fgets(char *buffer, int size, FILE *fp);
// char buf[100];
// fgets(buf, 100, fp);  // reads up to 99 chars into buf


Point 2: 
"\n" and "\0" in the first problem: 

1.
'\0' — null terminator (end of string)
Value: 0
Purpose: Marks the end of a C string
Not printed — it’s invisible
C strings are just char arrays. The runtime doesn’t store the length; it scans until it hits '\0'.

char s[] = "hello";
// In memory: 'h' 'e' 'l' 'l' 'o' '\0'
//                              ↑
//                         string ends here


2.
'\n' — newline (line break)
Value: 10 (on most systems)
Purpose: Marks the end of a line in text
When printed: moves the cursor to the next line

"hello\nworld"
// prints as:
// hello
// world

Point 3: 
EOF = End of File 
--------------------------------------------------------------------------------------------------------
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ ./unit-tests
Reminder: These tests are not comprehensive, and passing them does not guarantee that your implementation is working.

Testing create_default_game (Task 1)...
All create_default_game (Task 1) tests passed!

Testing print_board (Task 3)...
All print_board (Task 3) tests passed!

Testing next_square (Task 4)...
All next_square (Task 4) tests passed!

Testing update_head (Task 4)...
All update_head (Task 4) tests passed!

Testing update_tail (Task 4)...
All update_tail (Task 4) tests passed!

Testing update_game (Task 4)...
All update_game (Task 4) tests passed!

Testing read_line (Task 5)...
All read_line (Task 5) tests passed!

Testing load_board (Task 5)...
Assertion error: expected board height to be 6 but got 18
test_load_board_2 failed. Check tests/06-small-in.snk for a diagram of the board.
Not all load_board (Task 5) tests passed.
------------------------------------------------------------------------------------------------------------
Solutions to Task 5： 


/* Task 5.1 */
char *read_line(FILE *fp) {
  // read the file line by line 
  // and how to process ? 

  size_t capacity = 16;
  size_t len = 0;
  char *line = malloc(capacity);
  
  if (line == NULL) {
    return NULL;
  }

  int c;
  while ((c = fgetc(fp)) != EOF) {
    if (len + 1 >= capacity) { 
      capacity *= 2;
      char *new_line = realloc(line, capacity);
      if (new_line == NULL) {
        free(line);
        return NULL;
      }
      line = new_line;
    }
    line[len++] = (char)c;
    if (c == '\n') {
      break;
    }
  }

  if (len == 0 && c == EOF) {
    free(line);
    return NULL;
  }

  line[len] = '\0';
  return line;

}




/* Task 5.2 */
game_t *load_board(FILE *fp) {
  game_t *game = malloc(sizeof(game_t));
  if (game == NULL) {
    return NULL;
  }

  game->num_rows = 0;
  game->num_snakes = 0;
  game->snakes = NULL;
  game->board = NULL;

  size_t capacity = 0;
  char *line;
  while ((line = read_line(fp)) != NULL) {
    if (game->num_rows >= capacity) {
      capacity = capacity == 0 ? 8 : capacity * 2;
      char **new_board = realloc(game->board, capacity * sizeof(char *));
      if (new_board == NULL) {
        for (unsigned int i = 0; i < game->num_rows; i++) {
          free(game->board[i]);
        }
        free(game->board);
        free(game);
        return NULL;
      }
      game->board = new_board;
    }
    game->board[game->num_rows] = line;
    game->num_rows++;
  }

  if (game->num_rows == 0) {
    free(game);
    return NULL;
  }

  return game;
}
-----------------------------------------------------------------------------

---

<a id="task-5"></a>
## Task 5:

My Own Solution Feedback: 
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make unit-tests
gcc -c -o src/unit_tests.o src/unit_tests.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
In file included from src/unit_tests.c:8:
src/game.c: In function ‘read_line’:
src/game.c:393:28: warning: conversion from ‘double’ to ‘size_t’ {aka ‘long unsigned int’} changes value from ‘7.5e-1’ to ‘0’ [-Wfloat-conversion]
  393 |   size_t boundary_factor = 0.75;
      |                            ^~~~
src/game.c:416:27: warning: conversion from ‘int’ to ‘char’ may change value [-Wconversion]
  416 |     res_lines[curr_len] = fgetc(fp);
      |                           ^~~~~
src/game.c: In function ‘load_board’:
src/game.c:436:1: warning: control reaches end of non-void function [-Wreturn-type]
  436 | }
      | ^
make[1]: Entering directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
make[1]: Leaving directory '/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter'
gcc -o unit-tests src/snake_utils.o src/unit_tests.o src/asserts.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
---------------------------------------------------------------------------

Additional Note: 
-Wno-unused-function -Wconversion -std=c99 -g

你贴出的三个 warning 都来自旧版 read_line / load_board。你现在的 game.c 已经是正确写法，重新 make unit-tests 应该不会再有这些警告。

下面分别解释旧代码里每个 warning 的原因：

1. boundary_factor = 0.75 → 变成 0
warning: conversion from 'double' to 'size_t' ... from '7.5e-1' to '0'
问题： size_t 是整数类型，0.75 是小数，赋值时会被截断为 0。


所以：
size_t boundary_factor = 0.75;  // 实际是 0！
init_size * boundary_factor      // 24 * 0 = 0
扩容条件几乎永远不对。

正确做法： 不要用小数。用整数比较，例如：

if (len + 1 >= capacity) {  // 快满了就扩容
    capacity *= 2;
}
2. fgetc 返回值赋给 char
warning: conversion from 'int' to 'char' may change value
问题： fgetc 返回 int，不是 char，因为要能表示 EOF（-1）。

旧代码：

while (fgetc(fp) != EOF) {      // 读了一次，但没保存
    res_lines[curr_len] = fgetc(fp);  // 又读一次 → 跳字符！
}
这里还有两个 bug：

每个循环读了两次字符，会跳过一半内容
直接赋给 char 可能和 EOF 混淆


正确做法：

int c;
while ((c = fgetc(fp)) != EOF) {
    line[len++] = (char)c;  // 存字符时再转成 char
    if (c == '\n') break;
}
3. load_board 没有 return
warning: control reaches end of non-void function
问题： 函数声明返回 game_t *，但函数体是空的，没有 return。

正确做法： 读完所有行后 return game;，出错时 return NULL;。

旧代码还缺什么
问题	后果
没在 \n 处停止
会把多行读成一行
fgetc 调用两次
丢字符
boundary_factor = 0
扩容逻辑错误
load_board 为空
无法加载棋盘
你现在的正确结构
你当前的 read_line 已经是对的：

char *read_line(FILE *fp) {
  size_t capacity = 16;
  size_t len = 0;
  char *line = malloc(capacity);
  // ...
  int c;
  while ((c = fgetc(fp)) != EOF) {
    if (len + 1 >= capacity) {
      capacity *= 2;
      // realloc...
    }
    line[len++] = (char)c;
    if (c == '\n') {
      break;
    }
  }
  // ...
}
重新编译：

make clean
make unit-tests
./unit-tests
如果还有 warning，把最新的 read_line 代码贴出来即可。

fgetc returns what ? 

fgetc 返回什么？
int c = fgetc(fp);
fgetc 从文件 fp 中读 1 个字符，返回值类型是 int，不是 char。

两种可能的返回值
返回值	含义
0 ~ 255
读到的字符（例如 'a'、'#'、'\n'）
EOF
文件结束（End Of File），没有更多数据
EOF 是一个宏，通常是 -1。

为什么返回 int 而不是 char？
因为 char 无法和 “文件结束” 区分开。

如果返回 char：所有值都是 0–255，没法单独表示 EOF
返回 int：可以用 -1 表示 EOF，0–255 表示正常字符
----------------------------------------------------------

---

<a id="task-6"></a>
## Task 6 --- find_head and initialize_snakes

---

<a id="task-6-2"></a>
## Task 6.2: initialize_snakes
nested for-loops: no records about num_cols but num_rows 
1. game->num_snakes are KNOWN 
2. num_cols : strlen(board[i]) - 1

----------------------------------------------------------

---

<a id="task-7"></a>
## Task 7: main
My Mistakes: call the dunctions directly ignoring the return types 

-----------------------------------------------------------------------------
zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ ./unit-tests
Reminder: These tests are not comprehensive, and passing them does not guarantee that your implementation is working.

Testing create_default_game (Task 1)...
All create_default_game (Task 1) tests passed!

Testing print_board (Task 3)...
All print_board (Task 3) tests passed!

Testing next_square (Task 4)...
All next_square (Task 4) tests passed!

Testing update_head (Task 4)...
All update_head (Task 4) tests passed!

Testing update_tail (Task 4)...
All update_tail (Task 4) tests passed!

Testing update_game (Task 4)...
All update_game (Task 4) tests passed!

Testing read_line (Task 5)...
All read_line (Task 5) tests passed!

Testing load_board (Task 5)...
All load_board (Task 5) tests passed!

Testing find_head (Task 6)...
All find_head (Task 6) tests passed!

Testing initialize_snakes (Task 6)...
All initialize_snakes (Task 6) tests passed!

----------------------------------------------------------------------------

---

<a id="integration-tests"></a>
## Integration tests

zy990718@ZOEZHU:/mnt/g/CSlearner/Cal_cs61c/fa25-proj1-starter$ make run-integration-tests
gcc -c -o src/snake.o src/snake.c -Wall -Wno-unused-function -Wconversion -std=c99 -g
gcc -o snake src/snake.o src/snake_utils.o src/game.o -Wall -Wno-unused-function -Wconversion -std=c99 -g
./snake -i "tests/01-simple-in.snk" -o "tests/01-simple-out.snk"
diff "tests/01-simple-ref.snk" "tests/01-simple-out.snk"
Passed 01-simple
./snake -i "tests/02-direction-in.snk" -o "tests/02-direction-out.snk"
diff "tests/02-direction-ref.snk" "tests/02-direction-out.snk"
Passed 02-direction
./snake -i "tests/03-tail-in.snk" -o "tests/03-tail-out.snk"
diff "tests/03-tail-ref.snk" "tests/03-tail-out.snk"
Passed 03-tail
./snake -i "tests/04-food-in.snk" -o "tests/04-food-out.snk"
diff "tests/04-food-ref.snk" "tests/04-food-out.snk"
Passed 04-food
./snake -i "tests/05-wall-in.snk" -o "tests/05-wall-out.snk"
diff "tests/05-wall-ref.snk" "tests/05-wall-out.snk"
Passed 05-wall
./snake -i "tests/06-small-in.snk" -o "tests/06-small-out.snk"
diff "tests/06-small-ref.snk" "tests/06-small-out.snk"
Passed 06-small
./snake -i "tests/07-medium-in.snk" -o "tests/07-medium-out.snk"
diff "tests/07-medium-ref.snk" "tests/07-medium-out.snk"
Passed 07-medium
./snake -i "tests/08-multisnake-in.snk" -o "tests/08-multisnake-out.snk"
diff "tests/08-multisnake-ref.snk" "tests/08-multisnake-out.snk"
Passed 08-multisnake
./snake -i "tests/09-everything-in.snk" -o "tests/09-everything-out.snk"
diff "tests/09-everything-ref.snk" "tests/09-everything-out.snk"
Passed 09-everything
./snake -i "tests/10-filled-in.snk" -o "tests/10-filled-out.snk"
diff "tests/10-filled-ref.snk" "tests/10-filled-out.snk"
Passed 10-filled
./snake -i "tests/11-manyclose-in.snk" -o "tests/11-manyclose-out.snk"
diff "tests/11-manyclose-ref.snk" "tests/11-manyclose-out.snk"
Passed 11-manyclose
./snake -i "tests/12-corner-in.snk" -o "tests/12-corner-out.snk"
diff "tests/12-corner-ref.snk" "tests/12-corner-out.snk"
Passed 12-corner
./snake -i "tests/13-sus-in.snk" -o "tests/13-sus-out.snk"
diff "tests/13-sus-ref.snk" "tests/13-sus-out.snk"
Passed 13-sus
./snake -i "tests/14-orochi-in.snk" -o "tests/14-orochi-out.snk"
diff "tests/14-orochi-ref.snk" "tests/14-orochi-out.snk"
Passed 14-orochi
./snake -i "tests/15-hydra-in.snk" -o "tests/15-hydra-out.snk"
diff "tests/15-hydra-ref.snk" "tests/15-hydra-out.snk"
Passed 15-hydra
./snake -i "tests/16-huge-in.snk" -o "tests/16-huge-out.snk"
diff -q "tests/16-huge-ref.snk" "tests/16-huge-out.snk"
Passed 16-huge
./snake -i "tests/17-wide-in.snk" -o "tests/17-wide-out.snk"
diff -q "tests/17-wide-ref.snk" "tests/17-wide-out.snk"
Passed 17-wide
./snake -i "tests/18-tall-in.snk" -o "tests/18-tall-out.snk"
diff -q "tests/18-tall-ref.snk" "tests/18-tall-out.snk"
Passed 18-tall
./snake -i "tests/19-101-127-in.snk" -o "tests/19-101-127-out.snk"
diff -q "tests/19-101-127-ref.snk" "tests/19-101-127-out.snk"
Passed 19-101-127
./snake -i "tests/20-long-line-in.snk" -o "tests/20-long-line-out.snk"
diff -q "tests/20-long-line-ref.snk" "tests/20-long-line-out.snk"
Passed 20-long-line
./snake -i "tests/21-bigL-in.snk" -o "tests/21-bigL-out.snk"
diff -q "tests/21-bigL-ref.snk" "tests/21-bigL-out.snk"
Passed 21-bigL
Passed 22-nonexistent-input-file
-----------------------------------------------------------------------------

---

<a id="final-notes"></a>
## Notes

Notes: 
1. 使用 powershell 的时候, 不需要使用 wsl 去启动 linux 环境。 
2. 不一定非要去到 web folder 
