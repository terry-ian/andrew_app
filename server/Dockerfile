FROM php:8.4-apache

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# 安裝 PHP 擴展
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mysqli \
    mbstring \
    zip \
    exif \
    pcntl \
    bcmath \
    gd

# 啟用 Apache mod_rewrite
RUN a2enmod rewrite

# 設定 Apache DocumentRoot
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 設定 Apache AllowOverride
RUN echo '<Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/docker-php.conf \
    && a2enconf docker-php

# 安裝 Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 設定工作目錄
WORKDIR /var/www/html

# 複製應用程式檔案
COPY . /var/www/html

# 設定檔案權限
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# 如果 composer.json 存在，安裝依賴
RUN if [ -f composer.json ]; then composer install --no-dev --optimize-autoloader; fi

# 暴露端口
EXPOSE 80

# 啟動 Apache
CMD ["apache2-foreground"]
