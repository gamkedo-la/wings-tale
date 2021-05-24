					var width       = GAME_W;
					var height      = GAME_H;
					var halfWidth   = width  >> 1;
					var halfHeight  = height >> 1;
					var size        = width * (height + 2) * 2;   // space for 2 images (old and new), +2 to cover ripple radius <= 3
					var delay       = 30;                         // delay is desired FPS
					var oldIdx      = width;
					var newIdx      = width * (height + 3);       // +2 from above size calc +1 more to get to 2nd image
					var rippleRad   = 3;

					var rippleMap   = [];
					var lastMap     = [];
					var mapIdx;
					
					// texture and ripple will hold the image data tco be displayed
					var ripple;
					var texture;
	
					// Initialize the maps
					for (var i = 0; i < size; i++)
					{
						lastMap[i]   = 0;
						rippleMap[i] = 0;
					}
					
					
					
					// -------------------------------------------------------
				// Drop something in the water at location: dx, dy
					// -------------------------------------------------------
					function dropAt(dx, dy)
					{
						// Make certain dx and dy are integers
						// Shifting left 0 is slightly faster than parseInt and math.* (or used to be)
						dx <<= 0;
						dy <<= 0;
						
					// Our ripple effect area is actually a square, not a circle
						for (var j = dy - rippleRad; j < dy + rippleRad; j++)
						{
							for (var k = dx - rippleRad; k < dx + rippleRad; k++)
							{
								rippleMap[oldIdx + (j * width) + k] += 512;
							}
						}
					}
					
					// -------------------------------------------------------
				// Create the next frame of the ripple effect
					// -------------------------------------------------------
					function rippleNewFrame()
					{
						var i;
						var a, b;
						var data, oldData;
						var curPixel, newPixel;
						
						i = oldIdx;
						oldIdx = newIdx;
						newIdx = i;
						
						i = 0;
						mapIdx = oldIdx;
						
						for (var y = 0; y < height; y++)
						{
							for (var x = 0; x < width; x++)
							{
						// Use rippleMap to set data value, mapIdx = oldIdx
						// Use averaged values of pixels: above, below, left and right of current
								data = (
										rippleMap[mapIdx - width] + 
										rippleMap[mapIdx + width] + 
										rippleMap[mapIdx - 1] + 
										rippleMap[mapIdx + 1]) >> 1;    // right shift 1 is same as divide by 2
								
						// Subtract 'previous' value (we are about to overwrite rippleMap[newIdx+i])
								data -= rippleMap[newIdx + i];
						
						// Reduce value more -- for damping
						// data = data - (data / 32)
								data -= data >> 5;
						
						// Set new value
								rippleMap[newIdx + i] = data;

						// If data = 0 then water is flat/still,
						// If data > 0 then water has a wave
								data = 1024 - data;
					
								oldData = lastMap[i];
								lastMap[i] = data;
					
								if (oldData != data)  // if no change no need to alter image
								{
						// Recall using "<< 0" forces integer value
									// Calculate pixel offsets
									a = (((x - halfWidth) * data / 1024) << 0) + halfWidth;
									b = (((y - halfHeight) * data / 1024) << 0) + halfHeight;
									
									// Don't go outside the image (i.e. boundary check)
									if (a >= width) a = width - 1;
									if (a < 0) a = 0;
									if (b >= height) b = height - 1;
									if (b < 0) b = 0;
						
						// Set indexes
									newPixel = (a + (b * width)) * 4;
									curPixel = i * 4;
									
						// Apply values
									ripple.data[curPixel]     = texture.data[newPixel];
									ripple.data[curPixel + 1] = texture.data[newPixel + 1];
									ripple.data[curPixel + 2] = texture.data[newPixel + 2];
								}
								mapIdx++;
								i++;
							}
						}
						//mapIdx = mapIdx;
					}
				
				