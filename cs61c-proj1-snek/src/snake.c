#include <stdio.h>
#include <string.h>

#include "snake_utils.h"
#include "game.h"

int main(int argc, char *argv[]) {

  bool io_stdin = false;
  char *in_filename = NULL;
  char *out_filename = NULL;
  game_t *game = NULL;

  
  // Parse arguments
  for (int i = 1; i < argc; i++) {
    if (strcmp(argv[i], "-i") == 0 && i < argc - 1) {
      if (io_stdin) {
        fprintf(stderr, "Usage: %s [-i filename | --stdin] [-o filename]\n", argv[0]);
        return 1;
      }
      in_filename = argv[i + 1];
      i++;
      continue;
    } else if (strcmp(argv[i], "--stdin") == 0) {
      if (in_filename != NULL) {
        fprintf(stderr, "Usage: %s [-i filename | --stdin] [-o filename]\n", argv[0]);
        return 1;
      }
      io_stdin = true;
      continue;
    }
    if (strcmp(argv[i], "-o") == 0 && i < argc - 1) {
      out_filename = argv[i + 1];
      i++;
      continue;
    }
    fprintf(stderr, "Usage: %s [-i filename | --stdin] [-o filename]\n", argv[0]);
    return 1;
  }

  // Do not modify anything above this line.


  /* Task 7 */
  // Read board from file, or create default board
  
  if (in_filename != NULL) {
    // The first revision: load_board takes in file pointer, in_filename is not a file pointer 
    FILE *fp = fopen(in_filename, "r");
    if (fp == NULL) {
      return -1;
    }
    game = load_board(fp);
    fclose(fp);
    // The second revision: notice the return type of function methods 
    // Be sure to read signature of function methods 
    game = initialize_snakes(game);
  } else if (io_stdin) {
    game = load_board(stdin);
    game = initialize_snakes(game);
  } else {
    game = create_default_game();
  }

  // Update game. Use deterministic_food to add food.
  update_game(game, deterministic_food);

  // Write updated board to file or stdout
  if (out_filename != NULL) {
    save_board(game, out_filename);
  } else {
    print_board(game, stdout);
  }
  free_game(game);
  return 0;
}







