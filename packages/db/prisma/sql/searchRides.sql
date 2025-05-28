-- prisma/sql/searchRides.sql
-- @name searchRides
-- @param {Float} $1:from_lng
-- @param {Float} $2:from_lat
-- @param {Int}   $3:radius
-- @param {Float} $4:to_lng
-- @param {Float} $5:to_lat

SELECT
  r.id,
  r.departure_time,
  r.available_seats,
  r.price,
  r.duration_s,
  r.distance_m,
  
  ST_Length(
    ST_LineSubstring(
      r.route::geometry,
      ST_LineLocatePoint(
        r.route::geometry,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ),
      ST_LineLocatePoint(
        r.route::geometry,
        ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
      )
    )::geography
  )::numeric(10,2) 
    AS segment_distance_m,

  (
    r.price
    * ST_Length(
        ST_LineSubstring(
          r.route::geometry,
          ST_LineLocatePoint(
            r.route::geometry,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
          ),
          ST_LineLocatePoint(
            r.route::geometry,
            ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
          )
        )::geography
      )
    / r.distance_m
  )::numeric(10,2) 
    AS segment_price,

  (
    (r.duration_s::double precision)
    * ST_Length(
        ST_LineSubstring(
          r.route::geometry,
          ST_LineLocatePoint(
            r.route::geometry,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
          ),
          ST_LineLocatePoint(
            r.route::geometry,
            ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
          )
        )::geography
      )
    / r.distance_m
  )::numeric(10,2) 
    AS segment_duration_s,

  (
    ST_Distance(
      dp.location,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
    ) <= 1000
    AND
    ST_Distance(
      destp.location,
      ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
    ) <= 1000
  ) 
    AS is_full_route,

  dp.id                        AS departure_point_id,
  dp.place_id                  AS departure_place_id,
  dp.city                      AS departure_city,
  dp.full_address              AS departure_full_address,
  dp.short_address             AS departure_short_address,

  destp.id                     AS destination_point_id,
  destp.place_id               AS destination_place_id,
  destp.city                   AS destination_city,
  destp.full_address           AS destination_full_address,
  destp.short_address          AS destination_short_address,

  u.id            AS creator_id,
  u.name          AS creator_name,
  u.profile_photo AS creator_photo,
  COALESCE(avg_rating.avg_score, 0)::numeric(3,2) AS creator_avg_rating,
  COALESCE(review_count.total_reviews, 0)       AS creator_total_reviews,

  v.brand AS vehicle_brand,
  v.name  AS vehicle_name,
  v.color AS vehicle_color,

  ST_Distance(
    dp.location,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
  )::numeric(10,2) AS departure_distance_m,

  ST_Distance(
    destp.location,
    ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
  )::numeric(10,2) AS destination_distance_m

FROM "Ride"    AS r
JOIN "Point"   AS dp    ON r.departure_point_id   = dp.id
JOIN "Point"   AS destp ON r.destination_point_id = destp.id
JOIN "User"    AS u     ON r."createdBy_id"       = u.id
LEFT JOIN "Vehicle" AS v ON v.id             = u."vehicleId"

LEFT JOIN LATERAL (
  SELECT AVG(rat.score)::float8 AS avg_score
  FROM "Rating" AS rat
  WHERE rat."recipientId" = u.id
) AS avg_rating ON TRUE

LEFT JOIN LATERAL (
  SELECT COUNT(*)::int AS total_reviews
  FROM "Review" AS rev
  WHERE rev."recipientId" = u.id
) AS review_count ON TRUE

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
  ST_LineLocatePoint(
    r.route::geometry,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
  ) < ST_LineLocatePoint(
    r.route::geometry,
    ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography
  )
;
