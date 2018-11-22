# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :animalia,
  ecto_repos: [Animalia.Repo]

# Configures the endpoint
config :animalia, AnimaliaWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "1DwWf5TC9eK2cDXWQoUeFL61HCsh5g1z6zwxXEAJb9EAbtrMQNffRlOubJSSXsZJ",
  render_errors: [view: AnimaliaWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Animalia.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
