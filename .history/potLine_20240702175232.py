import requests
import polyline

def get_route_coordinates(origin, destination, api_key):
    # URL for the directions API request
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={api_key}"

    # Perform the API request
    response = requests.get(url)
    directions = response.json()

    # Extract the polyline points
    steps = directions['routes'][0]['legs'][0]['steps']
    all_latlngs = []
    for step in steps:
        polyline_points = step['polyline']['points']
        latlngs = polyline.decode(polyline_points)
        all_latlngs.extend(latlngs)

    return all_latlngs

# Coordinates from the user
origin = "40.0293879,116.3489123"
destination = "40.0004029,116.3373682"
api_key = "YOUR_API_KEY"

route_coordinates = get_route_coordinates(origin, destination, api_key)
print(route_coordinates)
