defmodule AnimaliaWeb.RoomChannel do
  use AnimaliaWeb, :channel

  alias Animalia.PlayerState
  alias Animalia.ObjectState

  def join("game:room", payload, socket) do
    if authorized?(payload) do
      players = PlayerState.players()
      leaf = ObjectState.get_object()
      send(self(), {:after_join, payload})
      {:ok, %{players: players, leaf: leaf}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info({:after_join, _message}, socket) do
    player_id = socket.assigns.player_id
    player = %{"id" => player_id, "y" => 200, "x" => 200, "score" => 0, "direction" => "right"}
    player = PlayerState.put_player(player)
    broadcast_from socket, "player:joined", player
    {:noreply, socket}
  end

  def handle_in("player:move", player, socket) do
    player_id = socket.assigns.player_id
    player_out =
      cond do
        player["score"] < 3 && PlayerState.detect_collision_player_object(player) ->
          leaf = ObjectState.update_object()
          broadcast! socket, "leaf:position", leaf
          PlayerState.update_player(
            player_id,
            %{
              "id" => player_id,
              "x" => player["x"],
              "y" => player["y"],
              "direction" => player["direction"],
              "score" => player["score"] + 1
            })
        enemy_id = PlayerState.detect_collision_player_player(player_id, player) ->
          if (PlayerState.remove_player(enemy_id)) do
            broadcast! socket, "player:remove", %{id: enemy_id}
            PlayerState.update_player(
              player_id,
              %{
                "id" => player_id,
                "x" => player["x"],
                "y" => player["y"],
                "direction" => player["direction"],
                "score" => player["score"] + 2
              })
          else
            player
          end
        true ->
          PlayerState.update_player(player_id,
            %{
              "id" => player_id,
              "x" => player["x"],
              "y" => player["y"],
              "direction" => player["direction"],
              "score" => PlayerState.get_player(player_id)["score"]
            })
      end
    broadcast! socket, "player:position", player_out
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # This is invoked every time a notification is being broadcast
  # to the client. The default implementation is just to push it
  # downstream but one could filter or change the event.
  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end 

  def terminate(_reason, socket) do
    player_id = socket.assigns.player_id
    player = %{id: player_id}
    PlayerState.remove_player(player_id)
    broadcast socket, "player:disconnect", player
    {:noreply, socket}
  end

end
