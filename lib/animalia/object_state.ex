defmodule Animalia.ObjectState do

  @doc """
    Used by the supervisor to start the Agent that will keep the game state persistent.
  The initial value passed to the Agent is an empty map.
  """
  def start_link do
    Agent.start_link(
      fn -> %{
          name: "leaf",
          x: :rand.uniform(1200),
          y: :rand.uniform(760)
        }
      end,
      name: __MODULE__)
  end

  def put_object(object) do
    Agent.update(__MODULE__, &Map.put_new(&1, object.name, object))
    object
  end

  def get_object() do
    Agent.get(__MODULE__, fn state -> state end)
  end

  def update_object() do
    Agent.update(__MODULE__,
      fn object ->
        %{
          object |
          x: :rand.uniform(1200),
          y: :rand.uniform(760)
        }
      end)
    get_object()
  end
end
