# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["VelvetSkinClinic.csproj", "."]
RUN dotnet restore "VelvetSkinClinic.csproj"
COPY . .
RUN dotnet publish "VelvetSkinClinic.csproj" -c Release -o /app/publish

# Stage 3: Final
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VelvetSkinClinic.dll"]