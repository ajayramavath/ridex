-- @param {Float} $1:from_lng
-- @param {Float} $2:from_lat
-- @param {Int} $3:radius
-- @param {Float} $4:to_lng
-- @param {Float} $5:to_lat

SELECT
  r.*,
  u.id            AS creator_id,
  u.name          AS creator_name,
  u.email         AS creator_email,
  u.phone_number  AS creator_phone,
  u.profile_photo AS creator_photo,
  COALESCE(avg_rating.avg_score, 0)::numeric(3,2) AS creator_avg_rating,
  ST_Distance(
    dp.location,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
  )::numeric(10,2) AS departure_distance_m,
  -- distance from search‐destination to the ride’s stored destination point
  ST_Distance(
    destp.location,
    ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
  )::numeric(10,2) AS destination_distance_m
FROM
  "Ride"      AS r
  JOIN "Point" AS dp
    ON r.departure_point_id   = dp.id
  JOIN "Point" AS destp
    ON r.destination_point_id = destp.id
  JOIN "User" AS u
    ON r."createdBy_id" = u.id
  LEFT JOIN LATERAL (
    SELECT 
      AVG(rat.score)::float8 AS avg_score
    FROM 
      "Rating" AS rat
    WHERE 
      rat."recipientId" = u.id
  ) AS avg_rating ON TRUE
WHERE
  ST_DWithin(
    r.route,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
    $3
  )
  AND
  ST_DWithin(
    r.route,
    ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography,
    $3
  )
  AND
  ST_LineLocatePoint(r.route::geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326))
    < ST_LineLocatePoint(r.route::geometry, ST_SetSRID(ST_MakePoint($4, $5), 4326))
;
