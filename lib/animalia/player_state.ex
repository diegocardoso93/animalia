defmodule Animalia.PlayerState do
  require Logger
  alias Animalia.ObjectState

  @doc """
    Used by the supervisor to start the Agent that will keep the game state persistent.
  The initial value passed to the Agent is an empty map.
  """
  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def put_player(player) do
    Agent.update(__MODULE__, &Map.put_new(&1, player["id"], player))
    player
  end

  def get_player(player_id) do
    Agent.get(__MODULE__, &Map.get(&1, player_id))
  end

  def update_player(player_id, player) do
    Agent.update(__MODULE__, &Map.put(&1, player_id, player))
    Map.put(player, :id, player_id)
  end

  def remove_player(player_id) do
    Agent.get_and_update(__MODULE__, fn dict ->
      Map.pop(dict, player_id)
    end)
  end

  def players do
    Agent.get(__MODULE__, &(&1))
  end

  def detect_collision_player_object(player) do
    leaf = ObjectState.get_object()

    abs(player["x"] - leaf[:x]) < 20 &&
    abs(player["y"] - leaf[:y]) < 20
  end

  def detect_collision_player_player(player_id, player) do
    cond do
      player["score"] > 6 -> 60
      player["score"] > 4 -> 50
      player["score"] > 2 -> 40
      true -> 0
    end
    |> detect_first_colide(player, player_id)
  end

  def detect_first_colide(colision_px, player, player_id) do
    if colision_px > 0 do
      res = for {id, enemy} <- players(),
        id != player_id && abs(enemy["x"] - player["x"]) < colision_px &&
        abs(enemy["y"] - player["y"]) < colision_px,
        do: id
      Logger.info "[detect_first_colide] #{inspect Enum.at(res, 0)}"
      Enum.at(res, 0)
    end
  end
end
