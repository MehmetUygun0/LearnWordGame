## Hata ayıklama kapsayıcınızı özelleştirme ve Visual Studio’nun daha hızlı hata ayıklama için görüntülerinizi derlemek üzere bu Dockerfile'ı nasıl kullandığı hakkında bilgi edinmek için https://aka.ms/customizecontainer sayfasına bakın.
#
## Bu aşama, VS'den hızlı modda çalıştırıldığında kullanılır (Hata ayıklama yapılandırması için varsayılan olarak ayarlıdır)
#FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
#USER $APP_UID
#WORKDIR /app
#EXPOSE 8080
#EXPOSE 8081
#
#
## Bu aşama, hizmet projesini oluşturmak için kullanılır
#FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
#ARG BUILD_CONFIGURATION=Release
#WORKDIR /src
##COPY ["Backend/Backend.csproj", "Backend/"]
##RUN dotnet restore "./Backend/Backend.csproj"
#COPY ["Backend.csproj", "./"]
#RUN dotnet restore "./Backend.csproj"
#COPY . .
#WORKDIR "/src/Backend"
#RUN dotnet build "./Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build
#
## Bu aşama, son aşamaya kopyalanacak hizmet projesini yayımlamak için kullanılır
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "./Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
## Bu aşama üretimde veya VS'den normal modda çalıştırıldığında kullanılır (Hata Ayıklama yapılandırması kullanılmazken varsayılan olarak ayarlıdır)
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "Backend.dll"]
# 1. Aşama: Çalıştırma ortamı (Base)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# 2. Aşama: Derleme (Build)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Sadece proje dosyasını kopyalayıp restore yapıyoruz (Hız için)
COPY ["Backend.csproj", "./"]
RUN dotnet restore "./Backend.csproj"

# Geri kalan her şeyi kopyala
COPY . .

# Projeyi derle
RUN dotnet build "Backend.csproj" -c Release -o /app/build

# 3. Aşama: Yayınlama (Publish)
FROM build AS publish
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 4. Aşama: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Backend.dll"]