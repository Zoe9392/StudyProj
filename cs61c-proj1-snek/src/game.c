#include "game.h"

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "snake_utils.h"

/* Helper function definitions */
static void set_board_at(game_t *game, unsigned int row, unsigned int col, char ch);
static bool is_tail(char c);
static bool is_head(char c);
static bool is_snake(char c);
static char body_to_tail(char c);
static char head_to_body(char c);
static unsigned int get_next_row(unsigned int cur_row, char c);
static unsigned int get_next_col(unsigned int cur_col, char c);
static void find_head(game_t *game, unsigned int snum);
static char next_square(game_t *game, unsigned int snum);
static void update_tail(game_t *game, unsigned int snum);
static void update_head(game_t *game, unsigned int snum);


/* Task 1 */

/* Hints from documentation: 

1.The board has 18 rows, and each row has 20 columns. 
2.The fruit is at row 2, column 9 (zero-indexed). 
3.The tail is at row 2, column 2, and the head is at row 2, column 4.
4.Which part of memory (code, static, stack, heap) should you store the new game in?
5.strcpy may be helpful.
6.Each row of the board must be terminated by a new line character + null terminator and must be a valid string.

*/

game_t *create_default_game() {
  // Initial setting required by the hints 
  // think about how to index the location to set 

  /* Initialize the game_t struct */ 
  game_t *new_game = malloc(sizeof(game_t));
  new_game->num_rows = 18;
  new_game->num_snakes = 1; 
  
  // char **board | board is a pointer to a pointer, so we need to allocate memory twice for the memory.
  new_game->board = malloc(new_game->num_rows  * sizeof(char*));
  for (unsigned int i = 0; i < new_game->num_rows; i++) {
    new_game->board[i] = malloc(22 * sizeof(char)); // 20 cols + newline + null terminator
  }

  // set all empty spaces and boarder cells
  for (unsigned int i = 0; i < new_game->num_rows; i++) {
    if (i == 0 || i == new_game->num_rows - 1) {
      strcpy(new_game->board[i], "####################");
    } else {
      strcpy(new_game->board[i], "#                  #");
    }
    new_game->board[i][20] = '\n';
    new_game->board[i][21] = '\0'; // 
  }

  // set the fruit, the head, the tail, and the body of the snake on the board
  new_game->board[2][9] = '*';
  new_game->board[2][2] = 'd';
  new_game->board[2][4] = 'D';
  new_game->board[2][3] = '>';
  
  // Fix 1: Cursor Updated --- snake_t struct inside the game_t 
  new_game->snakes = malloc(sizeof(snake_t));
  new_game->snakes->tail_row = 2;
  new_game->snakes->tail_col = 2;
  new_game->snakes->head_row = 2;
  new_game->snakes->head_col = 4;
  new_game->snakes->live = true; 

  return new_game;
}



/* Task 2 */
void free_game(game_t *game) {
  // Notice the malloc calls . Recall the data and address heap memory segmentation with data and address 
  // Free the REVERSE order of calls
  // consider edge case first 
  if(game == NULL){
    return; 
  }
  for(unsigned int i = 0; i < game->num_rows; i++){
    free(game->board[i]);
  }
  free(game->board);
  free(game->snakes);
  free(game);
}


/* Task 3 */
/* Hints: 
Implement the print_board function in game.c. 
This function should print out the given game board to the given file pointer.
1.game_t* game	A pointer to the game_t struct to be printed
2.FILE* fp	A pointer to the file object where the board should be printed to
*/

void print_board(game_t *game, FILE *fp) {
  // Think: how to print the board ? print eachline 
  if(game == NULL || fp == NULL){
    return;
  }

  for(unsigned int i = 0; i < game->num_rows; i++){
    // Cursor + Google fprintf usage 
    fprintf(fp, "%s", game->board[i]);
  }

}



/*
  Saves the current game into filename. Does not modify the game object.
  (already implemented for you).
*/
void save_board(game_t *game, char *filename) {
  FILE *f = fopen(filename, "w");
  print_board(game, f);
  fclose(f);
}




/* Task 4.1 */
/*
  Helper function to get a character from the board
  (already implemented for you).
*/
char get_board_at(game_t *game, unsigned int row, unsigned int col) { 
  return game->board[row][col]; 
}

/*
  Helper function to set a character on the board
  (already implemented for you).
*/
static void set_board_at(game_t *game, unsigned int row, unsigned int col, char ch) {
  game->board[row][col] = ch;
}

/*
  Returns true if c is part of the snake's tail.
  The snake consists of these characters: "wasd"
  Returns false otherwise.
*/
static bool is_tail(char c) {
  // if char c is one of "wasd"
  if(c == 'w' || c == 'a' || c == 's' || c == 'd'){
    return true;
  }
  return false;
}

/*
  Returns true if c is part of the snake's head.
  The snake consists of these characters: "WASDx"
  Returns false otherwise.
*/
static bool is_head(char c) {
  // The same logic with the previous function 
  if(c == 'W' || c == 'A' || c == 'S' || c == 'D' || c == 'x'){
    return true;
  }
  return false;
}

/*
  Returns true if c is part of the snake.
  The snake consists of these characters: "wasd^<v>WASDx"
*/
static bool is_snake(char c) {
  // snake contains tail, head, and body 
  if(is_tail(c) || is_head(c)){
    return true;
  } else if(c == '<' || c == '>' || c == '^' || c == 'v' || c == 'x'){
    return true;
  }
  return false;
}


/*
  Converts a character in the snake's body ("^<v>")
  to the matching character representing the snake's
  tail ("wasd").
*/

static char body_to_tail(char c) {
  switch(c){
    case '^':
      return 'w';
    case '<':
      return 'a';
    case 'v':
      return 's';
    case '>':
      return 'd';
    default:
      return '?';
  }

}

/*
  Converts a character in the snake's head ("WASD")
  to the matching character representing the snake's
  body ("^<v>").
*/
static char head_to_body(char c) {
  switch(c){
    case 'W':
      return '^';
    case 'A':
      return '<';
    case 'S':
      return 'v';
    case 'D':
      return '>';
    default:
      return '?';
  }
}

/*
  Returns cur_row + 1 if c is 'v' or 's' or 'S'.
  Returns cur_row - 1 if c is '^' or 'w' or 'W'.
  Returns cur_row otherwise.
*/
static unsigned int get_next_row(unsigned int cur_row, char c) {

  if (c == 'v' || c == 's' || c == 'S'){
    return cur_row + 1;
  } else if (c == '^' || c == 'w' || c == 'W'){
    return cur_row - 1;
  } else {
    return cur_row;
  }   
}

/*
  Returns cur_col + 1 if c is '>' or 'd' or 'D'.
  Returns cur_col - 1 if c is '<' or 'a' or 'A'.
  Returns cur_col otherwise.
*/

static unsigned int get_next_col(unsigned int cur_col, char c) {
  
  if(c == '>' || c == 'd' || c == 'D'){
    return cur_col + 1;
  } else if (c == '<' || c == 'a' || c == 'A'){
    return cur_col - 1;
  } else {
    return cur_col;
  }

}



/*
  Task 4.2

  Helper function for update_game. Return the character in the cell the snake is moving into.
  This function should not modify anything.

*/

static char next_square(game_t *game, unsigned int snum) {
  // Step 1: get the current head position --> how ? use the snake struct 
  unsigned int curr_head_row = game->snakes[snum].head_row;
  unsigned int curr_head_col = game->snakes[snum].head_col;
  char curr_head = get_board_at(game, curr_head_row, curr_head_col); 
  // Step 2: get the next position, think about the snakes' moving direction: previous helper functions 
  unsigned int next_row = get_next_row(curr_head_row, curr_head);
  unsigned int next_col = get_next_col(curr_head_col, curr_head);
  // Step 3: get the character in the next position, think about the boarder cells and the snake's body and head 
  return get_board_at(game, next_row, next_col);
}


/*
  Task 4.3

  Helper function for update_game. Update the head...
  ...on the board: add a character where the snake is moving
  ...in the snake struct: update the row and col of the head
  Note that this function ignores food, walls, and snake bodies when moving the head.

*/


static void update_head(game_t *game, unsigned int snum) {
  // Step 1: get the current head position and character 
  unsigned int curr_head_row = game->snakes[snum].head_row;
  unsigned int curr_head_col = game->snakes[snum].head_col;
  char curr_head = game->board[curr_head_row][curr_head_col];
  
  // Step 2: figure out the corresponding body chracter and the position of next square 
  char head_body = head_to_body(curr_head);
  
  unsigned int next_row = get_next_row(curr_head_row, head_body);
  unsigned int next_col = get_next_col(curr_head_col, head_body);
  
  // Step 3: update the board and the snake struct 
  set_board_at(game, curr_head_row, curr_head_col, head_body);
  set_board_at(game, next_row, next_col, curr_head);
  game->snakes[snum].head_row = next_row;
  game->snakes[snum].head_col = next_col;

}





/*
  Task 4.4
  Helper function for update_game. Update the tail...
  ...on the board: blank out the current tail, and change the new
  tail from a body character (^<v>) into a tail character (wasd)
  ...in the snake struct: update the row and col of the tail
*/  

static void update_tail(game_t *game, unsigned int snum) { 

  unsigned int curr_tail_row = game->snakes[snum].tail_row;
  unsigned int curr_tail_col = game->snakes[snum].tail_col;
  char curr_tail = get_board_at(game, curr_tail_row, curr_tail_col);

  unsigned int next_row = get_next_row(curr_tail_row, curr_tail);
  unsigned int next_col = get_next_col(curr_tail_col, curr_tail);
  char new_tail = body_to_tail(get_board_at(game, next_row, next_col));

  set_board_at(game, curr_tail_row, curr_tail_col, ' ');
  set_board_at(game, next_row, next_col, new_tail);

  game->snakes[snum].tail_row = next_row;
  game->snakes[snum].tail_col = next_col;

}




/* Task 4.5 */
void update_game(game_t *game, int (*add_food)(game_t *game)) {
  unsigned int total_snakes = game->num_snakes;
  
  for(unsigned int i = 0; i < total_snakes; i++){
    char next_cell = next_square(game, i);
    if(next_cell == ' '){
      // do not have to move each part of the snake to move one step 
      update_head(game, i);
      update_tail(game, i);
    } else if(next_cell == '*'){
      update_head(game, i);
      add_food(game);
    } else if(next_cell == '#' || is_snake(next_cell)){
      game->snakes[i].live = false;
      set_board_at(game, game->snakes[i].head_row, game->snakes[i].head_col, 'x');      
    }
  }
  // Update Point 1: each snake moves one step in the direction of the head  
  // steps: each snakes; get the head and direction;check the crash ;move the whole body 
  // Update Point 2: crashes --- crash the other's snake body and the wall 
  // Update Point 3: eat fruits 
}



/* Task 5.1 

    ---------------------------
      ###############\n\0   ----> read the first line from the file pointer
    ---------------------------  
      #     W       #\n\0
      #     ^       #\n\0
      #     ^       #\n\0
      #     w       #\n\0
      #             #\n\0
      #             #\n\0 
      ###############\n\0

*/

char *read_line(FILE *fp) { 
  // The goal of this function is to read a line from the file pointer and return a string. 
  // The board of the game: 
  // the usage of fgetc: read one character from the file pointer and returns an integer. 
  size_t init_cap = 24;
  size_t curr_len = 0;
  char *res_line = malloc(init_cap);
  if (res_line == NULL) {
    return NULL;
  }
  int fgetc_result; // fgetc returns an integer  
  while ((fgetc_result = fgetc(fp)) != EOF) {
    if (curr_len + 1 >= init_cap) {
      size_t new_cap = init_cap * 2;
      char *new_line = realloc(res_line, new_cap);
      if (new_line == NULL) {
        free(res_line);
        return NULL;
      }
      res_line = new_line;
      init_cap = new_cap;
    }
    
    res_line[curr_len] = (char)fgetc_result;
    curr_len++;
    
    if(fgetc_result == '\n'){ // while loop ends condition: new line separator
      break;
    }
  }

  if (curr_len == 0 && fgetc_result == EOF) {
    free(res_line);
    return NULL;
  }

  res_line[curr_len] = '\0'; // null terminator
  return res_line;

}




/* Task 5.2 
-----------------------------------------
char **board  
  [0] --->   ###############\n\0   ---> char* 
  [1] --->   #     W       #\n\0
  [2] --->   #     ^       #\n\0
  [3] --->   #     ^       #\n\0
  [4] --->   #     w       #\n\0
  [ ] (unused)
  [ ] (unused)
  [ ] (unused)
-----------------------------------------
Resize (double the num_rows )the 2D array after use: 
char **board  
  [0] --->   ###############\n\0   ---> char* 
  [1] --->   #     W       #\n\0
  [2] --->   #     ^       #\n\0
  [3] --->   #     ^       #\n\0
  [4] --->   #     w       #\n\0
  [5] --->   #             #\n\0
  [6] --->   #             #\n\0
  [7] --->   #             #\n\0
  [8] --->   #     W       #\n\0
  [9] --->   #     ^       #\n\0
  [10] --->  #     ^       #\n\0
  [11] --->  #     w       #\n\0
  [12] --->  #             #\n\0
  [13] --->  #             #\n\0
  [14] --->  #             #\n\0
  [15] --->  ###############\n\0

*/

game_t *load_board(FILE *fp) {
  // The goal of this function is to load the board from the file pointer and return a game_t struct.
  // Initialize the original settings of the game_t struct: 
  game_t *new_game = malloc(sizeof(game_t));
  if(new_game == NULL){
    return NULL;
  }

  new_game->num_rows = 0;
  new_game->num_snakes = 0;
  new_game->snakes = NULL;
  new_game->board = NULL;
  
  // Same idea as create_default_game's board, but num_rows is unknown upfront.
  size_t board_cap = 8;
  new_game->board = malloc(board_cap * sizeof(char *));
  // null case check 
  if (new_game->board == NULL) {
    free(new_game);
    return NULL;
  }

  char *each_line;
  
  while ((each_line = read_line(fp)) != NULL) {
    // resize the board and its memory management 
    // check the condition of the board: if the board is full, resize the board
    if(new_game->num_rows >= board_cap - 1){
      // update the new board cap : double the size of the board when the old board is nearly full 
      board_cap = board_cap * 2;
      char **board = realloc(new_game->board, board_cap * sizeof(char*));
      // null case check 
      if(board == NULL){
        free(new_game->board);
        free(new_game);
        return NULL;
      }
      // update the new board 
      new_game->board = board;
    }
    // load the content of each line into the board 
    new_game->board[new_game->num_rows] = each_line;
    new_game->num_rows++;
  }
  // null case check: if the board is empty, free the game_t struct
  if (new_game->num_rows == 0) {
    free(new_game);
    return NULL;
  }

  return new_game;
}



/*
  Task 6.1
  Helper function for initialize_snakes.
  Given a snake struct with the tail row and col filled in,
  trace through the board to find the head row and col, and
  fill in the head row and col in the struct.
*/


static void find_head(game_t *game, unsigned int snum) {
  // Trace from the known tail along body arrows until we hit a head (WASDx).
  unsigned int row = game->snakes[snum].tail_row;
  unsigned int col = game->snakes[snum].tail_col;
  char curr_char = get_board_at(game, row, col);

  while (!is_head(curr_char) ) {
    unsigned int next_row = get_next_row(row, curr_char);
    unsigned int next_col = get_next_col(col, curr_char);
    row = next_row;
    col = next_col;
    curr_char = get_board_at(game, row, col);
  }
  game->snakes[snum].head_row = row;
  game->snakes[snum].head_col = col;
}



/* Task 6.2 

Tasks Decomposition: 

*/

game_t *initialize_snakes(game_t *game) {
  // After load_board, num_snakes is 0 — count tails first, then allocate.
  unsigned int count = 0;
  for (unsigned int i = 0; i < game->num_rows; i++) {
    for (unsigned int j = 0; j < strlen(game->board[i]) - 1; j++) {
      if (is_tail(get_board_at(game, i, j))) {
        count++;
      }
    }
  }

  game->num_snakes = count;
  game->snakes = malloc(count * sizeof(snake_t));
  if (count > 0 && game->snakes == NULL) {
    return NULL;
  }

  unsigned int snake_index = 0;
  for (unsigned int i = 0; i < game->num_rows; i++) {
    for (unsigned int j = 0; j < strlen(game->board[i]) - 1; j++) {
      if (is_tail(get_board_at(game, i, j))) {
        game->snakes[snake_index].tail_row = i;
        game->snakes[snake_index].tail_col = j;
        find_head(game, snake_index);
        game->snakes[snake_index].live = true;
        snake_index++;
      }
    }
  }
  return game;
}























































































































































