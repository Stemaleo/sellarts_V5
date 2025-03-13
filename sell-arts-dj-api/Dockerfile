FROM python:3.13.1

# Upgrade pip
RUN python -m pip install --upgrade pip
WORKDIR /app
# copy the project into the docker container
COPY . .

# Install dependencies
RUN pip install poetry \
    && poetry lock && poetry install --only main

# # Donner la permissions à entrypoint.sh
RUN chmod +x /app/entrypoint.sh


# # Define the entrypoint
CMD [ "bash", "entrypoint.sh"]

