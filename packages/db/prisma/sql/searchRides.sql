-- prisma/sql/searchRides.sql
-- @name searchRides
-- @param {Float} $1:from_lng
-- @param {Float} $2:from_lat
-- @param {Int}   $3:radius
-- @param {Float} $4:to_lng
-- @param {Float} $5:to_lat

WITH loci AS (
  SELECT
    r.id                   AS ride_id,
    r.price,
    r.available_seats,
    r.departure_time,
    r.distance_m,
    r.duration_s,
    r."createdBy_id"       AS created_by_id,
    r.route,
    -- departure point columns
    dp.id                  AS departure_point_id,
    dp.place_id            AS departure_place_id,
    dp.city                AS departure_city,
    dp.full_address        AS departure_full_address,
    dp.short_address       AS departure_short_address,
    dp.location            AS departure_location,
    -- destination point columns
    destp.id               AS destination_point_id,
    destp.place_id         AS destination_place_id,
    destp.city             AS destination_city,
    destp.full_address     AS destination_full_address,
    destp.short_address    AS destination_short_address,
    destp.location         AS destination_location,

    -- how far along the line each search‐point lies (fraction 0–1)
    ST_LineLocatePoint(
      r.route::geometry,
      ST_SetSRID(ST_MakePoint($1, $2),4326)::geography
    ) AS start_frac,
    ST_LineLocatePoint(
      r.route::geometry,
      ST_SetSRID(ST_MakePoint($4, $5),4326)::geography
    ) AS end_frac

  FROM "Ride"      AS r
  JOIN "Point"     AS dp    ON r.departure_point_id   = dp.id
  JOIN "Point"     AS destp ON r.destination_point_id = destp.id

  WHERE
    ST_DWithin(
      r.route,
      ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,
      $3
    )
    AND
    ST_DWithin(
      r.route,
      ST_SetSRID(ST_MakePoint($4,$5),4326)::geography,
      $3
    )
    AND
    -- ensure “to” comes after “from” along the route
    ST_LineLocatePoint(
      r.route::geometry,
      ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
    ) < ST_LineLocatePoint(
      r.route::geometry,
      ST_SetSRID(ST_MakePoint($4,$5),4326)::geography
    )
)

SELECT
  -- basic ride info
  loci.ride_id        AS id,
  loci.departure_time,
  loci.available_seats,
  loci.price,
  loci.distance_m,
  loci.duration_s,

  (loci.departure_time
   + (loci.duration_s * loci.start_frac) * INTERVAL '1 second'
  ) AS estimated_pickup_time,
  (loci.departure_time
   + (loci.duration_s * loci.end_frac) * INTERVAL '1 second'
  ) AS estimated_dropoff_time,

  ST_X(loci.departure_location::geometry) AS departure_lng,
  ST_Y(loci.departure_location::geometry) AS departure_lat,
  ST_X(loci.destination_location::geometry) AS destination_lng,
  ST_Y(loci.destination_location::geometry) AS destination_lat,

  -- passenger’s segment length (m)
  ST_Length(
    ST_LineSubstring(
      loci.route::geometry,
      loci.start_frac,
      loci.end_frac
    )::geography
  )::numeric(10,2) AS segment_distance_m,

  -- prorated segment duration (s)
  (
    (loci.duration_s::double precision)
    * ST_Length(
        ST_LineSubstring(
          loci.route::geometry,
          loci.start_frac,
          loci.end_frac
        )::geography
      )
    / loci.distance_m
  )::numeric(10,2) AS segment_duration_s,

  (
    loci.price
    * ST_Length(
        ST_LineSubstring(
          loci.route::geometry,
          loci.start_frac,
          loci.end_frac
        )::geography
      )
    / loci.distance_m
  )::numeric(10,2) AS segment_price,

  ST_X(
    ST_LineInterpolatePoint(loci.route::geometry, loci.start_frac)
  ) AS pickup_lng,
  ST_Y(
    ST_LineInterpolatePoint(loci.route::geometry, loci.start_frac)
  ) AS pickup_lat,
  ST_X(
    ST_LineInterpolatePoint(loci.route::geometry, loci.end_frac)
  ) AS dropoff_lng,
  ST_Y(
    ST_LineInterpolatePoint(loci.route::geometry, loci.end_frac)
  ) AS dropoff_lat,

  (
    ST_Distance(
      loci.departure_location,
      ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
    ) <= 1000
    AND
    ST_Distance(
      loci.destination_location,
      ST_SetSRID(ST_MakePoint($4,$5),4326)::geography
    ) <= 1000
  ) AS is_full_route,

  -- departure point details
  loci.departure_point_id,
  loci.departure_place_id,
  loci.departure_city,
  loci.departure_full_address,
  loci.departure_short_address,

  -- destination point details
  loci.destination_point_id,
  loci.destination_place_id,
  loci.destination_city,
  loci.destination_full_address,
  loci.destination_short_address,

  -- creator & ratings
  u.id            AS creator_id,
  u.name          AS creator_name,
  u.profile_photo AS creator_photo,
  COALESCE(avg_rating.avg_score, 0)::numeric(3,2) AS creator_avg_rating,
  COALESCE(review_count.total_reviews, 0)       AS creator_total_reviews,

  -- vehicle data
  v.id     AS vehicle_id,
  v.brand  AS vehicle_brand,
  v.name  AS vehicle_name,
  v.color  AS vehicle_color,
  v.photo1 AS vehicle_photo1,
  v.photo2 AS vehicle_photo2,

  -- distances from search points to the stored points
  ST_Distance(
    loci.departure_location,
    ST_SetSRID(ST_MakePoint($1,$2),4326)::geography
  )::numeric(10,2) AS departure_distance_m,
  ST_Distance(
    loci.destination_location,
    ST_SetSRID(ST_MakePoint($4,$5),4326)::geography
  )::numeric(10,2) AS destination_distance_m

FROM loci

JOIN "User"    AS u ON loci.created_by_id = u.id
LEFT JOIN "Vehicle" AS v ON u."vehicleId" = v.id

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
;
