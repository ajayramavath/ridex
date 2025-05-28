-- @param {String} $1:departurePointId
-- @param {String} $2:destinationPointId
-- @param {String} $3:route
-- @param {String} $4:polyline
-- @param {DateTime} $5:departureTime
-- @param {Int} $6:availableSeats
-- @param {Decimal} $7:price
-- @param {String} $8:createdBy_id
-- @param {Int} $9:distance_m
-- @param {String} $10:duration_s
-- @param {Decimal} $11:pricePerKm


INSERT INTO "Ride" (
  "departure_point_id",
  "destination_point_id",
  "route",
  "polyline",
  "departure_time",
  "available_seats",
  "price",
  "createdBy_id",
  "distance_m",
  "duration_s",
  "pricePerKm"
)
VALUES (
  $1,                          
  $2,                            
  (ST_GeomFromText($3, 4326))::geography,
  $4,                             
  $5::timestamp without time zone,                             
  $6,                             
  $7,                            
  $8,
  $9,
  $10,
  $11                              
)
RETURNING id;