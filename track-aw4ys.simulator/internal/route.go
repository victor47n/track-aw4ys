package internal

import (
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Directions struct {
	Lat float64 `bson: "lat" json: "lat"`
	Lng float64 `bson: "lng" json: "lng"`
}

type Route struct {
	Id           string       `bson: "_id" json: "id"`
	Distance     int          `bson: "distance" json: "distance"`
	Directions   []Directions `bson: "directions" json: "directions"`
	FreightPrice float64      `bson: "freight_price" json: "freight_price"`
}

func NewRoute(id string, distance int, directions []Directions) *Route {
	return &Route{
		Id:         id,
		Distance:   distance,
		Directions: directions,
	}
}

type FreightService struct{}

func (fs *FreightService) Calculate(distance int) float64 {
	return math.Floor((float64(distance)*0.15+0.3)*100) / 100
}

func NewFreightService() *FreightService {
	return &FreightService{}
}

type RouteService struct {
	mong           *mongo.Client
	freightService *FreightService
}

func NewRouteService(mong *mongo.Client, freightService *FreightService) *RouteService {
	return &RouteService{
		mong:           mong,
		freightService: freightService,
	}
}

func (rs *RouteService) CreateRoute(route *Route) (*Route, error) {
	route.FreightPrice = rs.freightService.Calculate(route.Distance)

	update := bson.M{
		"$set": bson.M{
			"distance":      route.Distance,
			"directions":    route.Directions,
			"freight_price": route.FreightPrice,
		},
	}

	filter := bson.M{"_id": route.Id}
	options := options.Update().SetUpsert(true)

	_, err := rs.mong.Database("routes").Collection("routes").UpdateOne(nil, filter, update, options)

	if err != nil {
		return nil, err
	}

	return route, err
}

func (rs *RouteService) GetRoute(id string) (Route, error) {
	var route Route

	filter := bson.M{"_id": id}

	err := rs.mong.Database("routes").Collection("routes").FindOne(nil, filter).Decode(&route)

	if err != nil {
		return Route{}, err
	}

	return route, nil
}
