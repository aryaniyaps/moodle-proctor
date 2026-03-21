FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev zip libicu-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install mysqli gd intl zip opcache \
    && a2enmod rewrite

# Set PHP settings
RUN echo "max_input_vars=5000" >> /usr/local/etc/php/php.ini

# Copy Moodle
WORKDIR /var/www/html
RUN rm -rf *
RUN git clone -b MOODLE_404_STABLE https://github.com/moodle/moodle.git .

# Permissions
RUN chown -R www-data:www-data /var/www/html

