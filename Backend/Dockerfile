FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Backend/Backend.csproj Backend/
RUN dotnet restore Backend/Backend.csproj

COPY Backend/. Backend/
RUN dotnet publish Backend/Backend.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Backend.dll"]
