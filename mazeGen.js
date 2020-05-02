function createMaze(w, h, cx, cy)
{
	// With and height not set? stop
  if (!w || !h)
    return [];

	// Store all the visited areas
	var visited = [];

  // Build the array
  var map = [];

	// Creates the 2nd dimension of the array
  for (var i = 0; i < w; i++)
    map[i] = [];

	// Offset if the array doesn't fit our needs.
  var offX = 1 - (cx % 2);
  var offY = 1 - (cy % 2);

	// Init the map and the visited array
  for (var i = 0; i < w; i++)
  {
    for (var j = 0; j < h; j++)
    {
      map[i][j] = false;
      visited[i + j * w] = false;
    }
  }
  
  // Fill each 2nd cell with a true (those are the rooms)
  for (var i = 0; i < w - offX; i++)
  {
    for (var j = 0; j < h - offY; j++)
    {
      if (i % 2 == 1 && j % 2 == 1 && i < w - (1 + offX) && j < h - (1 + offY))
        map[i + offX][j + offY] = true;
      else
        map[i + offX][j + offY] = false;
    }
  }

	// Set the start point of the visit
  var todo = [{ x: 1 + offX, y: 1 + offY }];
  var done = [];

  visited[todo[0].x + todo[0].y * w] = true;
  var maxSteps = Math.round(w * h / 3);

	// While we have something to visit
  while (todo.length > 0 && maxSteps > 0)
  {
    maxSteps--;
    // Pick a random item from the todo
    var s = Math.floor(Math.random() * todo.length);
    var c = todo[s];
    done[done.length] = c;
    todo.splice(s, 1);

		// Check if we can go to a room left (2 cells left)
    if (c.x > 1 + offX && visited[(c.x - 2) + c.y * w] == false)
    {
      todo[todo.length] = { x: c.x - 2, y: c.y };
      visited[(c.x - 2) + c.y * w] = true;
      // Open the wall to left
      map[(c.x) - 1][c.y] = true;
    }
		// Check if we can go to a room up (2 cells up)
    if (c.y > 1 + offY && visited[(c.x) + (c.y - 2) * w] == false)
    {
      todo[todo.length] = { x: c.x, y: c.y - 2 };
      visited[(c.x) + (c.y - 2) * w] = true;
      // Open the wall to up
      map[c.x][(c.y) - 1] = true;
    }
		// Check if we can go to a room right (2 cells right)
    if (c.x + 2 < w - 1 && visited[(c.x + 2) + c.y * w] == false)
    {
      todo[todo.length] = { x: c.x + 2, y: c.y };
      visited[(c.x + 2) + c.y * w] = true;
      // Open the wall to right
      map[(c.x) + 1][c.y] = true;
    }
		// Check if we can go to a room right (2 cells down)
    if (c.y + 2 < h - 1 && visited[(c.x) + (c.y + 2) * w] == false)
    {
      todo[todo.length] = { x: c.x, y: c.y + 2 };
      visited[(c.x) + (c.y + 2) * w] = true;
      // Open the wall to bottom
      map[c.x][(c.y) + 1] = true;
    }
  }

  return map;
}