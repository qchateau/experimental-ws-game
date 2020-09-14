#pragma once

#include <memory>
#include <string>

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <spdlog/spdlog.h>

#include "config.h"

namespace si {

class world_t;

class listener_t : public std::enable_shared_from_this<listener_t> {
public:
    listener_t(net::io_context& ioc, world_t& world, tcp::endpoint endpoint);

    void run();

private:
    net::awaitable<void> on_run();

    net::io_context& ioc_;
    tcp::acceptor acceptor_;
    world_t& world_;
};

} // si